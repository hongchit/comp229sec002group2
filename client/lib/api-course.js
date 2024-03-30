const list = async (userId, token, signal) => {
  try {
    let response = await fetch("/api/user/" + userId + "/courses/", {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const create = async (userId, course, token, signal) => {
  try {
    let response = await fetch("/api/user/" + userId + "/courses/", {
      method: "POST",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(course),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const getCourse = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      "/api/user/" + params.userId + "/courses/" + params.courseId,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export { list, create, getCourse };
// export { create, list, read, update, remove };
