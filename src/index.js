const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}];

let idCount = links.length

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
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
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }
      links.push(link)
      return link
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
    }
  }
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers
});

server.listen()
  .then(({ url }) => console.log(`Server is running on ${url}`));
