import HanziWriterClient from './client';

export function generateStaticParams() {
  // Pre-render for single-character HSK 1 words
  const chars = [
    '爱','八','白','百','北','不','茶','吃','出','大','的','地','弟','东','对',
    '多','二','发','飞','分','高','个','工','关','国','好','和','黑','很','后',
    '花','话','会','火','机','家','叫','进','九','就','开','来','老','了','冷',
    '里','两','零','六','妈','买','没','美','门','米','面','明','名','年','你',
    '怒','女','七','气','钱','请','人','日','三','上','少','是','说','四','她',
    '他','太','天','听','同','头','外','完','玩','为','我','五','下','先','想',
    '小','写','学','也','一','已','用','有','月','在','再','长','张','中','走',
  ];
  return [...new Set(chars)].map((char) => ({ char: encodeURIComponent(char) }));
}

export default async function HanziCharPage({
  params,
}: {
  params: Promise<{ char: string }>;
}) {
  const { char } = await params;
  return <HanziWriterClient char={decodeURIComponent(char)} />;
}
