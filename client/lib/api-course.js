const list = async (currentUserInfo, signal) => {
  try {
    if (!currentUserInfo) {
      // TODO: Redirect to Login Page
      return [];
    }

    let response = await fetch(
      "/api/user/" + currentUserInfo.user._id + "/courses/",
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentUserInfo.token,
        },
      }
    );

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

export { list, getCourse };
// export { create, list, read, update, remove };
