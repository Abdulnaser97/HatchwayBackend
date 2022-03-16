const testData = {
  unsorted: [
    [
      {
        author: "Zackery Turner",
        authorId: 12,
        id: 2,
        likes: 469,
        popularity: 0.68,
        reads: 90406,
        tags: ["startups", "tech", "history"],
      },
      {
        author: "Trevon Rodriguez",
        authorId: 5,
        id: 8,
        likes: 735,
        popularity: 0.76,
        reads: 8504,
        tags: ["culture", "history"],
      },
    ],
    [
      {
        author: "Rylee Paul",
        authorId: 9,
        id: 1,
        likes: 960,
        popularity: 0.13,
        reads: 50361,
        tags: ["tech", "health"],
      },
      {
        author: "Zackery Turner",
        authorId: 12,
        id: 2,
        likes: 469,
        popularity: 0.68,
        reads: 90406,
        tags: ["startups", "tech", "history"],
      },
      {
        author: "Elisha Friedman",
        authorId: 8,
        id: 4,
        likes: 728,
        popularity: 0.88,
        reads: 19645,
        tags: ["science", "design", "tech"],
      },
    ],
  ],

  filtered: [
    {
      author: "Rylee Paul",
      authorId: 9,
      id: 1,
      likes: 960,
      popularity: 0.13,
      reads: 50361,
      tags: ["tech", "health"],
    },
    {
      author: "Zackery Turner",
      authorId: 12,
      id: 2,
      likes: 469,
      popularity: 0.68,
      reads: 90406,
      tags: ["startups", "tech", "history"],
    },
    {
      author: "Elisha Friedman",
      authorId: 8,
      id: 4,
      likes: 728,
      popularity: 0.88,
      reads: 19645,
      tags: ["science", "design", "tech"],
    },
    {
      author: "Trevon Rodriguez",
      authorId: 5,
      id: 8,
      likes: 735,
      popularity: 0.76,
      reads: 8504,
      tags: ["culture", "history"],
    },
  ],
  ascSorted: {
    byId: [
      {
        author: "Rylee Paul",
        authorId: 9,
        id: 1,
        likes: 960,
        popularity: 0.13,
        reads: 50361,
        tags: ["tech", "health"],
      },
      {
        author: "Zackery Turner",
        authorId: 12,
        id: 2,
        likes: 469,
        popularity: 0.68,
        reads: 90406,
        tags: ["startups", "tech", "history"],
      },
      {
        author: "Elisha Friedman",
        authorId: 8,
        id: 4,
        likes: 728,
        popularity: 0.88,
        reads: 19645,
        tags: ["science", "design", "tech"],
      },
      {
        author: "Trevon Rodriguez",
        authorId: 5,
        id: 8,
        likes: 735,
        popularity: 0.76,
        reads: 8504,
        tags: ["culture", "history"],
      },
    ],
    byReads: [
      {
        author: "Trevon Rodriguez",
        authorId: 5,
        id: 8,
        likes: 735,
        popularity: 0.76,
        reads: 8504,
        tags: ["culture", "history"],
      },
      {
        author: "Elisha Friedman",
        authorId: 8,
        id: 4,
        likes: 728,
        popularity: 0.88,
        reads: 19645,
        tags: ["science", "design", "tech"],
      },
      {
        author: "Rylee Paul",
        authorId: 9,
        id: 1,
        likes: 960,
        popularity: 0.13,
        reads: 50361,
        tags: ["tech", "health"],
      },
      {
        author: "Zackery Turner",
        authorId: 12,
        id: 2,
        likes: 469,
        popularity: 0.68,
        reads: 90406,
        tags: ["startups", "tech", "history"],
      },
    ],
    byLikes: [
      {
        author: "Zackery Turner",
        authorId: 12,
        id: 2,
        likes: 469,
        popularity: 0.68,
        reads: 90406,
        tags: ["startups", "tech", "history"],
      },

      {
        author: "Elisha Friedman",
        authorId: 8,
        id: 4,
        likes: 728,
        popularity: 0.88,
        reads: 19645,
        tags: ["science", "design", "tech"],
      },
      {
        author: "Trevon Rodriguez",
        authorId: 5,
        id: 8,
        likes: 735,
        popularity: 0.76,
        reads: 8504,
        tags: ["culture", "history"],
      },
      {
        author: "Rylee Paul",
        authorId: 9,
        id: 1,
        likes: 960,
        popularity: 0.13,
        reads: 50361,
        tags: ["tech", "health"],
      },
    ],
    byPopularity: [
      {
        author: "Rylee Paul",
        authorId: 9,
        id: 1,
        likes: 960,
        popularity: 0.13,
        reads: 50361,
        tags: ["tech", "health"],
      },
      {
        author: "Zackery Turner",
        authorId: 12,
        id: 2,
        likes: 469,
        popularity: 0.68,
        reads: 90406,
        tags: ["startups", "tech", "history"],
      },
      {
        author: "Trevon Rodriguez",
        authorId: 5,
        id: 8,
        likes: 735,
        popularity: 0.76,
        reads: 8504,
        tags: ["culture", "history"],
      },

      {
        author: "Elisha Friedman",
        authorId: 8,
        id: 4,
        likes: 728,
        popularity: 0.88,
        reads: 19645,
        tags: ["science", "design", "tech"],
      },
    ],
  },
};

module.exports = testData;