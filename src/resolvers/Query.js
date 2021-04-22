async function feed(parent, args, context, info) {
  const where = args.filter ? { OR: [
    {description: { contains: args.filter}},
    {url: { contains: args.filter}}
  ]} : {}

  const links = await context.prisma.link.findMany({where})
  return links
}

function info() {
  return 'This is the API of a Hackernews Clone'
}

async function link(parent, args, context, info) {
  return context.prisma.link.findUnique({
    where: {
      id: parseInt(args.id)
    }
  })
}

module.exports = {
  feed,
  info,
  link
}
