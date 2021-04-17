async function feed(parent, args, context, info) {
  return context.prisma.link.findMany()
}

function info() {
  return 'This is the API of a Hackernews Clone'
}

async function link(parent, args, context, info) {
  return context.prisma.link.findUnique({
    where: {
      id: parseInt(arg.id)
    }
  })
}

module.exports = {
  feed,
  info,
  link
}
