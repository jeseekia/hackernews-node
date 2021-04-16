const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent, args, context, info) => {
      return context.prisma.link.findMany()
    },
    link: (parent, args) => {
      for(let i=0; i<links.length; i++){
        if(links[i]['id'] === args.id) {
          return links[i];
        }
      }
    }
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description
        }
      });
      return newLink
    },
    updateLink: (parent, args) => {
      //can i reference the existing link by id query?
      for(let i=0; i<links.length; i++){
        if(links[i]['id'] === args.id){
          links[i]['description'] = args.description || links[i]['description'];
          links[i]['url'] = args.url || links[i]['url'];
          return links[i];
        }
      }
      //is returning null the typical way to communicate failure?
      return null;
    },
    deleteLink: (parent, args) => {
      for(let i=0; i<links.length; i++){
        if(links[i]['id'] === args.id){
          return links.splice(i, 1)[0];
        }
      }
      return null;
    }
  }
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: {
    prisma
  }
});

server.listen()
  .then(({ url }) => console.log(`Server is running on ${url}`));
