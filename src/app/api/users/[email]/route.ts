export async function GET(
    request: Request,
    { params }: { params: Promise<{ email: string }> }
  ) {
    const email = (await params).email 
    return Response.json({data:email})
  }