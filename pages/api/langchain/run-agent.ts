import { NextApiRequest, NextApiResponse } from 'next';
import { AgentExecutor } from 'langchain/agents';
import { StructuredTool, WikipediaQueryRun } from 'langchain/tools';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';
import { z } from 'zod';
import { convert } from 'html-to-text';
import { search, SafeSearchType } from 'duck-duck-scrape';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';
import type { Page, Browser } from 'puppeteer';
import OpenAI from 'openai';

function htmlToText(html: string) {
  return convert(html, {
    wordwrap: false,
    selectors: [
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' },
    ],
  });
}

// this tool should scrape the given webpage and return the text
// should be edge runtime-compatible
class ScrapeTool extends StructuredTool {
  schema = z.object({
    url: z.string().describe('The URL to scrape'),
  });

  name = 'scrape';

  description = 'Scrape a webpage and return the text';

  constructor() {
    // @ts-ignore
    super(...arguments);
  }

  async _call(input: { url: string }) {
    const { url } = input;
    const result = await ScrapeTool.scrape(url);
    return result;
  }

  static async scrape(url: string) {
    try {
      const result = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        },
      });
      const html = await result.text();
      const text = htmlToText(html);

      return JSON.stringify({ text });
    } catch {
      return JSON.stringify({ text: 'Failed to fetch or parse response.' });
    }
  }
}

class DuckDuckGoSearchTool extends StructuredTool {
  schema = z.object({
    query: z.string().describe('The query to search'),
  });

  name = 'search';

  description = 'Search DuckDuckGo';

  constructor() {
    // @ts-ignore
    super(...arguments);
  }

  async _call(input: { query: string }) {
    const { query } = input;
    const result = await DuckDuckGoSearchTool.search(query);
    return result;
  }

  static async search(query: string) {
    const searchResults = await search(query, {
      safeSearch: SafeSearchType.STRICT,
    });

    return JSON.stringify({ searchResults });
  }
}

// now we want a puppeteer tool
class PuppeteerTool extends StructuredTool {
  schema = z.object({
    url: z.string().describe('The URL to scrape'),
  });

  name = 'puppeteer';

  description = 'Scrape a webpage and return the text';

  constructor() {
    // @ts-ignore
    super(...arguments);
  }

  async _call(input: { url: string }) {
    const { url } = input;
    const result = await PuppeteerTool.scrape(url);
    return result;
  }

  static async scrape(url: string) {
    try {
      const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
          headless: true,
        },
        gotoOptions: {
          waitUntil: 'domcontentloaded',
        },
        /** Pass custom evaluate, in this case you get page and browser instances */
        async evaluate(page: Page, _browser: Browser) {
          await page.waitForResponse(url);

          const result = await page.evaluate(() => document.body.innerHTML);
          return result;
        },
      });

      const html = await loader.load();
      const text = htmlToText(html.toString());

      return JSON.stringify({ text });
    } catch {
      return JSON.stringify({ text: 'Failed to fetch or parse response.' });
    }
  }
}

class ImageGenerationTool extends StructuredTool {
  schema = z.object({
    prompts: z.array(z.string()).describe('The prompts to use'),
  });

  name = 'image-generation';

  description = 'Generate images from prompts';

  constructor() {
    // @ts-ignore
    super(...arguments);
  }

  async _call(input: { prompts: string[] }) {
    const { prompts } = input;
    const result = await ImageGenerationTool.generateImages(prompts);
    return result;
  }

  static async generateImages(prompts: string[]) {
    const openai = new OpenAI();
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompts.join('\n'),
      n: prompts.length,
      quality: 'hd',
      size: '1792x1024',
      style: 'natural',
      response_format: 'b64_json',
    });

    return JSON.stringify({ images: response.data });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | { error: string }>
) {
  try {
    let { content } = req.body;

    const tools = [new ScrapeTool(), new DuckDuckGoSearchTool(), new WikipediaQueryRun()];

    const agent = new OpenAIAssistantRunnable({
      assistantID: 'asst_qRtCHul1Mv6mSBFQSBJITjfn',
      asAgent: true,
    });

    const agentExecutor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
    });

    const assistantResponse = await agentExecutor.invoke({
      content,
    });

    return res.status(200).json(assistantResponse);
  } catch (error) {
    console.error('The API encountered an error:', error);

    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
