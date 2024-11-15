export default async function Page({
    params,
  }: {
    params: Promise<{ chat: string }>
  }) {
    const chat = (await params).chat
    return <div>My chat: {chat}</div>
}