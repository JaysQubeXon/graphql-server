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
  const [video] = videos.filter((video) => {
    return video.id === id;
  });

  resolve(video);
});

const getVideos = () => new Promise((resolve) => resolve(videos));

const createVideo = ({ title, duration, released }) => {
  const video = {
    //create your unique id number:
    //id: (new Buffer(title, 'utf8')).toString('base64'), original yet advised against in documentation.
    id: (Buffer.from(title,[duration, released], 'utf8')).toString('base64'),
    /*passing a string, array, or Buffer as the first
    argument copies the passed object's data into the Buffer.
    base64 ==> when creating a Buffer from a string, this encoding will also
    correctly accept "URL and Filename Safe Alphabet" as specified in RFC4648 Section 5.*/
    title,
    duration,
    released,
  }
  videos.push(video);

  return video;
};

exports.getVideoById = getVideoById;

exports.getVideos = getVideos;

exports.createVideo = createVideo;
//in conjunction with gql_lesson10
