export async function GET(
    request: Request,
    { params }: { params: Promise<{ user: string }> }
  ) {
    const slug = (await params).user // 'a', 'b', or 'c'
  }