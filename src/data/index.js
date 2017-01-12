const videoA = {
  id: 'a',
  title: 'Create a GraphQL Schema',
  duration: 120,
  watched: true,
};

const videoB = {
  id: 'b',
  title: 'Ember.js CLI',
  duration: 240,
  watched: false,
};

const videos = [videoA, videoB];

const getVideoById = (id) => new Promise((resolve) => {
  //: To implement this we are going to go through and get the video after
  //filtering through all the videos and for each video, we will check the server
  //that the current video.id matches the given id. at the end we will
  //resolve with the (video).
  const [video] = videos.filter((video) => {
    return video.id === id;
  });

  resolve(video);
});

exports.getVideoById = getVideoById;
//in conjunction with gql_lesson7 + gql_lesson8
