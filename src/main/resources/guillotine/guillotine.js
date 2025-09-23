// Using the Person data type
const personType = "com_example_myapp_Person_Data";

// Define GraphQL types for Red Cross local groups
const LocalGroupType = new graphQL.GraphQLObjectType({
  name: 'LocalGroup',
  fields: {
    branchId: { type: graphQL.GraphQLString },
    branchNumber: { type: graphQL.GraphQLString },
    organizationNumber: { type: graphQL.GraphQLString },
    branchType: { type: graphQL.GraphQLString },
    branchName: { type: graphQL.GraphQLString },
    branchStatus: {
      type: new graphQL.GraphQLObjectType({
        name: 'BranchStatus',
        fields: {
          isActive: { type: graphQL.GraphQLBoolean },
          creationDate: { type: graphQL.GraphQLString },
          isTerminated: { type: graphQL.GraphQLBoolean }
        }
      })
    },
    branchParent: {
      type: new graphQL.GraphQLObjectType({
        name: 'BranchParent',
        fields: {
          branchId: { type: graphQL.GraphQLString },
          branchNumber: { type: graphQL.GraphQLString },
          branchName: { type: graphQL.GraphQLString },
          branchType: { type: graphQL.GraphQLString }
        }
      })
    },
    branchLocation: {
      type: new graphQL.GraphQLObjectType({
        name: 'BranchLocation',
        fields: {
          municipality: { type: graphQL.GraphQLString },
          county: { type: graphQL.GraphQLString },
          region: { type: graphQL.GraphQLString },
          postalAddress: {
            type: new graphQL.GraphQLObjectType({
              name: 'PostalAddress',
              fields: {
                addressLine1: { type: graphQL.GraphQLString },
                postalCode: { type: graphQL.GraphQLString },
                postOffice: { type: graphQL.GraphQLString }
              }
            })
          }
        }
      })
    },
    communicationChannels: {
      type: new graphQL.GraphQLObjectType({
        name: 'CommunicationChannels',
        fields: {
          phone: { type: graphQL.GraphQLString },
          email: { type: graphQL.GraphQLString },
          web: { type: graphQL.GraphQLString }
        }
      })
    },
    branchContacts: {
      type: new graphQL.GraphQLList(new graphQL.GraphQLObjectType({
        name: 'BranchContact',
        fields: {
          role: { type: graphQL.GraphQLString },
          firstName: { type: graphQL.GraphQLString },
          lastName: { type: graphQL.GraphQLString },
          isVolunteer: { type: graphQL.GraphQLBoolean },
          isMember: { type: graphQL.GraphQLBoolean },
          memberNumber: { type: graphQL.GraphQLString }
        }
      }))
    },
    branchActivities: {
      type: new graphQL.GraphQLList(new graphQL.GraphQLObjectType({
        name: 'BranchActivity',
        fields: {
          globalActivityName: { type: graphQL.GraphQLString },
          localActivityName: { type: graphQL.GraphQLString }
        }
      }))
    }
  }
});

const LocalGroupsResponseType = new graphQL.GraphQLObjectType({
  name: 'LocalGroupsResponse',
  fields: {
    data: {
      type: new graphQL.GraphQLObjectType({
        name: 'LocalGroupsData',
        fields: {
          branches: { type: new graphQL.GraphQLList(LocalGroupType) }
        }
      })
    },
    metadata: {
      type: new graphQL.GraphQLObjectType({
        name: 'LocalGroupsMetadata',
        fields: {
          totalCount: { type: graphQL.GraphQLInt },
          timestamp: { type: graphQL.GraphQLString }
        }
      })
    }
  }
});

// Function to fetch data from Red Cross API
const fetchLocalGroups = async () => {
  try {
    const response = await fetch('https://api-dev.redcross.no/nrx/v1/organizations');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching local groups:', error);
    throw error;
  }
};

export const extensions = (graphQL) => {
  return {
    types: {
      LocalGroup: LocalGroupType,
      LocalGroupsResponse: LocalGroupsResponseType
    },
    creationCallbacks: {
      [personType]: function (params) {
        // Add a new field: age
        params.addFields({
          age: {
            type: graphQL.GraphQLInt,
          },
        });
      },
    },
    resolvers: {
      [personType]: {
        // Implement the age resolver
        age: (env) => {
          if (!env.source.dateofbirth) {
            return null;
          }

          // Calculate age
          let age = 0;
          const today = new Date();
          const birthDate = new Date(env.source.dateofbirth);
          age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();

          // Tune for month and day
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age;
        },
      },
      Query: {
        localGroups: async () => {
          return await fetchLocalGroups();
        }
      }
    },
  };
};
