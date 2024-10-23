/* eslint-disable max-classes-per-file */
import { NextApiRequest, NextApiResponse } from 'next';
import { AgentExecutor } from 'langchain/agents';
import { StructuredTool, WikipediaQueryRun } from 'langchain/tools';
import { OpenAIAssistantRunnable } from 'langchain/experimental/openai_assistant';
import { z } from 'zod';
import { convert } from 'html-to-text';
import { search, SafeSearchType } from 'duck-duck-scrape';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';
import type { Page, Browser } from 'puppeteer';

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
// used if the user wants to scrape a webpage that requires javascript
// should be edge runtime-compatible (cloudflare workers)
// should be able to use the puppeteer-web-base-loader
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | { error: string }>
) {
  try {
    const { content } = req.body;

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
