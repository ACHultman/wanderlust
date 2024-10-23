import { SimpleGrid } from '@mantine/core';
import Chat from '@/components/Chat';
import Map from '@/components/Map';
import { cssMainSize } from '@/theme';

export default function HomePage() {
  return (
    <SimpleGrid m="xl" cols={{ base: 1, sm: 2 }} h={cssMainSize}>
      <Chat />
      <Map />
    </SimpleGrid>
  );
}
