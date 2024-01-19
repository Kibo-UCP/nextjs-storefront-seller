const getB2BAccount = /* GraphQL */ `
  query b2bAccount($accountId: Int!) {
    b2bAccount(accountId: $accountId) {
      companyOrOrganization
      contacts {
        id
        accountId
        firstName
        lastNameOrSurname
        middleNameOrInitial
        types {
          name
          isPrimary
        }
        address {
          address1
          address2
          addressType
          cityOrTown
          countryCode
          isValidated
          postalOrZipCode
          stateOrProvince
        }
        phoneNumbers {
          home
          mobile
          work
        }
      }
      users {
        firstName
        lastName
        userId
      }
    }
  }
`

export default getB2BAccount
