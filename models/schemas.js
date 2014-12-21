var schemas = {
  user: {
    _id: null,
    email: null,
    password: null,
    type: null,
    created: null,
    last_login: null,
    activated: null
  },
  volunteer: {
    _id: null,
    user_id: null,
    first_name: null,
    last_name: null,
    gender: null,
    phone: null,
    firstTime: true,
    orientation_complete: false,
    background_complete: false,
    affiliation: null,
    special_ed: false,
    language_ed: false,
    about_me: null,
    two_children: false,
    image: null,
    pairs: [],
    availability: [],
    pair_request: {
      first_name: null,
      last_name: null,
      day: null,
      time: null
    }
  },
  parent: {
    _id: null,
    user_id: null,
    first_name: null,
    last_name: null,
    phone: null,
    image: null,
    children: []
  },
  child: {
    _id: null,
    parent_id: null,
    first_name: null,
    last_name: null,
    gender: null,
    age: null,
    grade: null,
    alt_phone: null,
    alt_parent: null,
    special_needs: false,
    language_needs: false,
    about_me: null,
    image: null,
    pair: null,
    pair_request: {
      first_name: null,
      last_name: null,
      day: null,
      time: null
    },
    availability: []
  },
  pair: {
    _id: null,
    volunteer: null,
    child: null,
    day: null,
    time: null
  }
}

module.exports = schemas;