import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Task: a
    .model({
      name: a.string().required(),
      description: a.string(),
      dueDate: a.datetime(),
      priority: a.enum(['high', 'medium', 'low']),
      timeSpent: a.integer().default(0),
      completed: a.boolean().default(false),
      owner: a.string(), // Will be populated by auth rule
    })
    .authorization((allow) => [allow.owner()]),

  Milestone: a
    .model({
      name: a.string().required(),
      date: a.datetime().required(),
      description: a.string(),
      completed: a.boolean().default(false),
      owner: a.string(), // Will be populated by auth rule
    })
    .authorization((allow) => [allow.owner()]),

  UserSettings: a
    .model({
      theme: a.string().default('light'),
      semesterStart: a.datetime(),
      semesterEnd: a.datetime(),
      owner: a.string(), // Will be populated by auth rule
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});