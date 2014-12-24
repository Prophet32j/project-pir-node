
  volunteer: {
    _id: null,
    user_id: null,
    first_name: null,
    last_name: null,
    gender: null,
    phone: null,
    first_time: true,
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
    reader_request: {
      first_name: null,
      last_name: null,
      day: null,
      time: null
    }
  },
  reader: {
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
    volunteer_request: {
      first_name: null,
      last_name: null,
      day: null,
      time: null
    },
    availability: []
  },
  pair: {
    _id: null,
    volunteer_id: null,
    reader_id: null,
    day: null,
    time: null
  }
}

module.exports = schemas;