import { gql } from 'graphql-request';

export default gql`
query GetAllProducts {
  products {
    id
    name
    slug
    price
    images {
      id
      url
    }
  }
}`;