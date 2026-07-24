import { create, props } from '@stylexjs/stylex';
import { connection } from 'next/server';

import UrlEncoder from '@/features/url-encoder/url-encoder';

const styles = create({
  main: {
    marginInline: 'auto',
    maxWidth: 850,
    minHeight: '100svh',
    paddingBlock: {
      default: 42,
      '@media (max-width: 520px)': 24,
    },
    paddingInline: {
      default: 28,
      '@media (max-width: 520px)': 16,
    },
    width: '100%',
  },
});

export default async function Home() {
  await connection();

  return (
    <main {...props(styles.main)}>
      <UrlEncoder />
    </main>
  );
}
