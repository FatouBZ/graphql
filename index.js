const { ApolloServer, gql } = require('apollo-server');
const uuid = require('uuid/v4');
const port = process.env.PORT || 4000;

const typeDefs = gql`
  type Quote {
    id: ID!
    phrase: String!
    quotee: String
  }

  type Query {
    quotes: [Quote]
  }
  type Mutation {
    addQuote(phrase: String!, quotee: String): Quote
    editQuote(id: ID!, phrase: String, quotee: String): Quote
    deleteQuote(id: ID!): DeleteResponse
  }

  type DeleteResponse {
    ok: Boolean!
  }

`;

const quotes = {};
const addQuote = quote => {
  const id = uuid();
  return quotes[id] = { ...quote, id };
};

// Start with a few initial quotes
addQuote({ phrase: "The purpose of our lives is to be happy..", quotee: "Dalai Lama" });
addQuote({ phrase: "Life is what happens when you’re busy making other plans", quotee: "John Lennon" });
addQuote({ phrase: "Too many of us are not living our dreams because we are living our fears.!", quotee: "Les Brown" });
addQuote({ phrase: "Life is a dream for the wise, a game for the fool, a comedy for the rich, a tragedy for the poor.!", quotee: "Sholom Aleichem" });
addQuote({ phrase: "Never let the fear of striking out keep you from playing the game.!", quotee: "Babe Ruth" });



const resolvers = {
  Query: {
    quotes: () => Object.values(quotes),
  },
  Mutation: {
    addQuote: async (parent, quote) => {
      return addQuote(quote);
    },
    editQuote: async (parent, { id, ...quote }) => {
      if (!quotes[id]) {
        throw new Error("Quote doesn't exist");
      }

      quotes[id] = {
        ...quotes[id],
        ...quote,
      };

      return quotes[id];
    },
    deleteQuote: async (parent, { id }) => {
      const ok = Boolean(quotes[id]);
      delete quotes[id];

      return { ok };
    },
  },
};
  

const server = new ApolloServer({ typeDefs, resolvers, playground: true, 
    introspection:true });

server.listen(port).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`); // eslint-disable-line no-console
});