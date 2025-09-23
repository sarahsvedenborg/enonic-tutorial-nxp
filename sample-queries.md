# Red Cross Local Groups API - Sample Queries

The guillotine API has been extended to include a new `localGroups` query that fetches data from the Red Cross organizations endpoint.

## Basic Query

Get all local groups with basic information:

```graphql
{
  localGroups {
    data {
      branches {
        branchId
        branchName
        branchType
        branchStatus {
          isActive
          creationDate
          isTerminated
        }
      }
    }
    metadata {
      totalCount
      timestamp
    }
  }
}
```

## Detailed Query

Get detailed information including location and contact details:

```graphql
{
  localGroups {
    data {
      branches {
        branchId
        branchNumber
        organizationNumber
        branchName
        branchType
        branchStatus {
          isActive
          creationDate
          isTerminated
        }
        branchParent {
          branchId
          branchName
          branchType
        }
        branchLocation {
          municipality
          county
          region
          postalAddress {
            addressLine1
            postalCode
            postOffice
          }
        }
        communicationChannels {
          phone
          email
          web
        }
        branchContacts {
          role
          firstName
          lastName
          isVolunteer
          isMember
          memberNumber
        }
        branchActivities {
          globalActivityName
          localActivityName
        }
      }
    }
    metadata {
      totalCount
      timestamp
    }
  }
}
```

## Filtered Query

Get only active local groups:

```graphql
{
  localGroups {
    data {
      branches {
        branchId
        branchName
        branchType
        branchStatus {
          isActive
        }
        branchLocation {
          municipality
          county
        }
        communicationChannels {
          email
          phone
        }
      }
    }
  }
}
```

## Query with Specific Fields

Get only contact information for local groups:

```graphql
{
  localGroups {
    data {
      branches {
        branchName
        branchLocation {
          municipality
          county
        }
        communicationChannels {
          email
          phone
          web
        }
        branchContacts {
          role
          firstName
          lastName
        }
      }
    }
  }
}
```

## Usage Notes

- The API fetches data from: `https://api-dev.redcross.no/nrx/v1/organizations`
- All data is fetched in real-time from the external API
- The response includes metadata with total count and timestamp
- Error handling is included for network issues
- The API returns all branches (local groups) from the Red Cross organization structure

## Data Structure

The API returns:
- **branches**: Array of local group objects
- **metadata**: Information about the response (total count, timestamp)

Each branch includes:
- Basic info (ID, name, type, status)
- Parent organization details
- Location information (municipality, county, region, postal address)
- Communication channels (phone, email, web)
- Contact persons with roles
- Activities offered by the local group
