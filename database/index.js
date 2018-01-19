const mysql = require('mysql');

let connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection({
    host: 'lg7j30weuqckmw07.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'ybr7ph732nxw8g1g',
    password: 'cmk1cc2z3q81thtz',
    database: 'e36d84um3m6uotkz'
  })
} else {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'yalp'
  })
}

const getUser = function (user, cb) {
  //user obj contain username & pw for authentication
  let query = `SELECT * FROM users;`

  connection.query(query, (err, results) => {
    if (err) {
      cb(err)
    } else {
      cb(null, results)
    }
  })
}

let checkUserExists = function(username, cb) {
  connection.query(`SELECT count(*) FROM users WHERE username='${username}'`, (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
};

const postUser = function (name, email, hw, username, cb) {
  let query = `INSERT INTO users (name, email, password, username) VALUES ('${name}', '${email}', '${hw}', '${username}');`
  connection.query(query, (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  })
}

//get hashword

let getHW = function(username, cb) {
  connection.query(`SELECT password FROM users WHERE username = '${username}'`, (err, results) => {
    if (err) {
      cb(err)
    } else {
      cb(null, results)
    }
  });
};

const getUserInfo = function (username, cb) {
  let query = `SELECT id, name, username, email FROM users WHERE username = '${username}'`

  connection.query(query, (err, results) => {
    if (err) {
      cb(err)
    } else {
      cb(null, results)
    }
  })
}

//get business by id

const getBusinessById = function (id, cb) {

  let query = `SELECT businesses.name FROM businesses WHERE businesses.id = ${id};`

  connection.query(query, (err, results) => {
    if (err) {
      cb(err)
    } else {
      cb(null, results)
    }
  })
}

const postDM = function(text, chatId, senderId, cb) {
  let query = `INSERT INTO messages (text, chat_id, sender_id) VALUES ('${text}', ${chatId}, ${senderId});`;
  connection.query(query, (err, results) => {
    err ? cb(err) : cb(null, results);
  });
};

const getChat = function(user1, user2, cb) {
  let query1 = `SELECT id FROM chats WHERE chats.user1 = ${user1} AND chats.user2 = ${user2};`;
  let query2 = `SELECT id FROM chats WHERE chats.user1 = ${user2} AND chats.user2 = ${user1};`;
  let query3 = `INSERT INTO chats (user1, user2) VALUES (${user1}, ${user2});`;

  connection.query(query1, (err, results) => {
    if (err) {
      cb(err)
    } else {
      if (results.length) {
        let chatId = results[0].id;
        connection.query(`SELECT * FROM messages WHERE chat_id = ${chatId};`, (err, results) => {
          err ? cb(err) : cb(null, results, chatId);
        });
      } else {
        connection.query(query2, (err, results) => {
          if (err) {
            cb(err)
          } else {
            if (results.length) {
              let chatId = results[0].id;
              connection.query(`SELECT * FROM messages WHERE chat_id = ${chatId};`, (err, results) => {
                err ? cb(err) : cb(null, results, chatId);
              });
            } else {
              connection.query(query3, (err, results) => {
                err ? cb(err) : getChat(user1, user2, cb);
              });
            }
          }
        });
      }
    }
  });
};

const friendChecker = function (userId, friendId, cb) {

  let query1 = `SELECT friends.user_id2 FROM friends WHERE friends.user_id1 = ${userId} AND friends.user_id2 = ${friendId};`;
  let query2 = `SELECT friends.user_id1 FROM friends WHERE friends.user_id2 = ${userId} AND friends.user_id1 = ${friendId};`;
  let checker = false;

  connection.query(query1, (err, results) => {
    if (err) {
      cb(err)
    } else if (results.length) {
      checker = true;
    }
  })
  connection.query(query2, (err, results) => {
    if (err) {
      cb(err)
    } else if (results.length) {
      checker = true;
    }
  })
  cb(null, checker);
}

const getYalpRatings = function (businessId, cb) {
  let query = `SELECT rating FROM reviews WHERE business_id = '${businessId}'`;
  connection.query(query, (err, results) => {
    if (err) {
      cb(err);
    } else {
      let totalReviews = 0;
      let totalScore = 0;
      let weightedAverage = 0;
      results.forEach(result => {
        totalScore += result.rating;
        totalReviews++;
      })
      weightedAverage = totalScore / totalReviews;
      let ratingsInfo = {
        weightedAverage: weightedAverage,
        totalReviews: totalReviews
      }
      cb (null, ratingsInfo);
    }
  })
}

const checkFavorite = function (userId, businessId, cb) {

  let query = `SELECT * FROM favorites WHERE favorites.user_id = ? AND favorites.business_id = ?;`

  connection.query(query, [userId, businessId], (err, results) => {
    if (err) {
      cb(err, false);
    } else {
      if (results.length) {
        cb(null, true)
      } else {
        cb(null, false)
      }
    }
  })
}

const toggleFavorite = function (userId, businessId, cb) {
  checkFavorite(userId, businessId, (err, bool) => {
    if (bool === true) {
      let query = `DELETE FROM favorites WHERE user_id = '${userId}' AND business_id = '${businessId}';`

      connection.query(query, [userId, businessId], (err, results) => {
        if (err) {
          cb(err, false)
        } else {
          cb(null, false)
        }
      })      
    } 
    else if (bool === false) {
      let query = `INSERT INTO favorites (user_id, business_id) VALUES (?, ?);`

      connection.query(query, [userId, businessId], (err, results) => {
        if (err) {
          cb(err, false)
        } else {
          cb(null, true)
        }
      })
    }

  })
}

const checkCheckIn = function (userId, businessId, cb) {

  let query = `SELECT * FROM checkins WHERE checkins.user_id = ${userId} AND checkins.business_id = "${businessId}";`

  connection.query(query, (err, results) => {
    if (err) {
      cb(err)
    } else {
      if (results.length) {
        cb(null, true)
      } else {
        cb(null, false)
      }
    }
  })
}

//for a particular business, return all checkins of friends
  //requires two separate checkin functions (getCheckins1 & getCheckins2), since friends table operates in two directions.
const getFriendsCheckins1 = function(userId, businessId, cb) {

  let query = `SELECT checkins.user_id, checkins.createdAt FROM checkins INNER JOIN friends ON friends.user_id1 = ${userId} AND checkins.business_id = ${businessId} AND friends.user_id2 = checkins.user_id;`;

  connection.query(query, (err, results) => {
    if (err) {
      cb(err)
    } else {
      cb(null, results)
    }
  })
}

const getFriendsCheckins2 = function(userId, businessId, cb) {

  let query = `SELECT checkins.user_id, checkins.createdAt FROM checkins INNER JOIN friends ON friends.user_id2 = ${userId} AND checkins.business_id = ${businessId} AND friends.user_id1 = checkins.user_id;`;

  connection.query(query, (err, results) => {
    if (err) {
      cb(err)
    } else {
      cb(null, results)
    }
  })
}

const getFriendsFavorites1 = function(userId, businessId, cb) {

  let query = `SELECT favorites.user_id, favorites.createdAt FROM favorites INNER JOIN friends ON friends.user_id1 = ${userId} AND favorites.business_id = ${businessId} AND friends.user_id2 = favorites.user_id;`;

  connection.query(query, (err, results) => {
    if (err) {
      cb(err)
    } else {
      cb(null, results)
    }
  })
}

const getFriendsFavorites2 = function(userId, businessId, cb) {

  let query = `SELECT favorites.user_id, favorites.createdAt FROM favorites INNER JOIN friends ON friends.user_id2 = ${userId} AND favorites.business_id = ${businessId} AND friends.user_id1 = favorites.user_id;`;

  connection.query(query, (err, results) => {
    if (err) {
      cb(err)
    } else {
      cb(null, results)
    }
  })
}

const addCheckIn = function (userId, businessId, cb) {
  checkCheckIn(userId, businessId, (err, bool) => {
    if (bool) {
      cb(false)
    } else {
      let query = `INSERT INTO checkins (user_id, business_id) VALUES (${userId}, "${businessId}");`

      connection.query(query, (err, results) => {
        if (err) {
          cb(err)
        } else {
          cb(null, results)
        }
      })
    }
  })
}

//temp function for searches, using mock data

const tempSearch = function (search, cb) {
  let query = `SELECT * FROM businesses;`

  connection.query(query, (err, results) => {
    if (err) {
      cb(err)
    } else {
      cb(null, results)
    }
  })
}

const addNewReview = function (userId, businessId, review, cb) {

  let query = 'INSERT INTO reviews (user_id, business_id, rating, text) VALUES (?, ?, ?, ?)';
  let params = [userId, businessId, review.rating, review.text];

  connection.query(query, params, (err, results) => {
    if (err) {
      console.log(err)
      cb(err)
    } else {
      cb(null, results)
    }
  })
}

const getUsernameById = function(userId, cb) {
  let query = `SELECT * FROM users WHERE id=${userId}`;

  connection.query(query, (err, results) => {
    if (err) {
      console.log(err)
      cb(err)
    } else {
      cb(null, results)
    }
  })
}

const getFavorite = function (userId, cb) {
  let query = 'SELECT * from favorites where favorites.user_id = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
};

// New version
const getFriends = function(userId, cb) {
  let query = `SELECT users.*, friends.is_pending, IF(friends.sender_id = ${userId}, 0, 1) AS is_receiver
    FROM users, friends
    WHERE (friends.sender_id = ${userId} AND users.id = friends.receiver_id)
    OR (friends.receiver_id = ${userId} AND users.id = friends.sender_id)`;
  connection.query(query, (err, results) => {
    err ? cb(err) : cb(null, results);
  });
};

// New version
const addFriend = function(senderId, receiverId, cb) {
  let query = `INSERT INTO friends (sender_id, receiver_id) VALUES (${senderId}, ${receiverId});`;
  connection.query(query, (err, results) => {
    err ? cb(err) : cb(null, results);
  });
}

// Brand new folks
const removeFriend = function(userId, userId2, cb) {
  let query = `DELETE FROM friends 
    WHERE (sender_id = ${userId} AND receiver_id = ${userId2})
    OR (sender_id = ${userId2} AND receiver_id = ${userId})`;
  connection.query(query, (err, results) => {
    err ? cb(err) : cb(null, results);
  });
};

const acceptFriend = function(senderId, receiverId, cb) {
  let query = `UPDATE friends SET is_pending = 0 WHERE sender_id = ${senderId} AND receiver_id = ${receiverId}`;
  connection.query(query, (err, results) => {
    err ? cb(err) : cb(null, results);
  });
}

const getCheckins = function(userId, cb) {
    let query = 'select a.id, businesses.name, a.createdAt from (select * from checkins where checkins.user_id = ?) a left join businesses on businesses.id = a.business_id;';

    connection.query(query, [userId], (err, results) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, results);
        }
    });
};

const getReviews = function(userId, cb) {
    let query = 'select a.id, businesses.name, a.text, a.rating, a.createdAt from (select * from reviews where reviews.user_id = ?) a left join businesses on a.business_id = businesses.id';

    connection.query(query, [userId], (err, results) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, results);
        }
    });

};

// get all reviews for a specific business
const getAllReviews = function(businessId, cb) {
  let query = `SELECT users.name, users.username, users.id, reviews.* FROM users, reviews WHERE reviews.user_id = users.id AND reviews.business_id = '${businessId}'`;
  connection.query(query, (err, results) => {
    err ? cb(err) : cb(null, results);
  });
};

// get friends' reviews for a specific business
const getFriendsReviews = function (userId, businessId, cb) {
  let query = `SELECT reviews.*, users.name, users.username FROM reviews, users WHERE business_id = "${businessId}" AND users.id = reviews.user_id AND reviews.text IN (SELECT reviews.text FROM reviews INNER JOIN friends ON ((friends.sender_id = ${userId} AND friends.receiver_id = reviews.user_id AND friends.is_pending = 0) OR (friends.receiver_id = ${userId} AND friends.sender_id = reviews.user_id AND friends.is_pending = 0)) AND business_id = "${businessId}");`;
  connection.query(query, (err, results) => {
    if (err) {
      cb(err);
    } else {
      cb(null, results);
    }
  });
}

// get non-friends' reviews for a specific business
const getStrangersReviews = function (userId, businessId, cb) {
  let query = `SELECT reviews.*, users.name, users.username FROM reviews, users WHERE business_id = "${businessId}" AND users.id = reviews.user_id AND reviews.text NOT IN (SELECT reviews.text FROM reviews INNER JOIN friends ON ((friends.sender_id = ${userId} AND friends.receiver_id = reviews.user_id AND friends.is_pending = 0) OR (friends.receiver_id = ${userId} AND friends.sender_id = reviews.user_id AND friends.is_pending = 0)) AND business_id = "${businessId}");`;
  connection.query(query, (err, results) => {
    if (err) {
      cb(err);
    } else {
      cb(null, results);
    }
  });
}

const getLoggedReviews = function(loggedId, businessId, cb) {
  let fullData = {};
  getFriendsReviews(loggedId, businessId, (err, results) => {
    if (err) {
      cb(err);
    } else {
      fullData.friendReviews = results;
      getStrangersReviews(loggedId, businessId, (err, results) => {
        if (err) {
          cb(err);
        } else {
          fullData.strangerReviews = results;
          cb(null, fullData);
        }
      });
    }
  });
}

const getFavorites = function(userId, cb) {
    let query = 'select a.id, businesses.name from (select * from favorites where favorites.user_id = ?) a left join businesses on businesses.id = a.business_id;';

    connection.query(query, [userId], (err, results) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, results);
        }
    });
};

const addSwoop = function(userId, businessId, swoopDate, cb) {
  let query = `INSERT INTO swoops (user_id, business_id, swoopDate) VALUES (${userId}, '${businessId}', '${swoopDate}')`;
  connection.query(query, (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
}

// businessId optional, a swoop list on search page will show all swoops by friends
// whereas on a page it will show all swoops by friends for that business. So, businessId
// will only be sent for the swoop rendering on business pages
const getSwoop = function(userId, businessId = 0) {
  var query;
  if (businessId = 0) {
    query = `SELECT DISTINCT swoops.* FROM swoops 
      INNER JOIN friends 
      WHERE is_pending = 0 AND (sender_id = ${userId} OR receiver_id = ${userId})
      AND (swoops.user_id = friends.receiver_id OR swoops.user_id = friends.sender_id)`;
  } else {
    query = `SELECT DISTINCT swoops.* FROM swoops 
      INNER JOIN friends 
      WHERE is_pending = 0 AND (sender_id = ${userId} OR receiver_id = ${userId})
      AND (swoops.user_id = friends.receiver_id OR swoops.user_id = friends.sender_id)
      AND (swoops.business_id = '${businessId}')`;
  }
  connection.query(query, (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
}

const deleteSwoop = function(userId, businessId, swoopDate, cb) {
  let query = `DELETE FROM swoops WHERE user_id = ${userId} AND business_id = '${businessId}' AND swoopDate = '${swoopDate}'`;
  connection.query(query, (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
}

//squad up
const addSquad = function(userId, swoopId, cb) {
  let query = `INSERT INTO squads (user_id, swoop_id) VALUES (${userId}, ${swoopId})`;
  connection.query(query, (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
}

const getSquad = function(swoopId, cb) {
  let query = `SELECT users.name FROM users
  INNER JOIN squads
  WHERE squads.user_id = users.id
  AND squads.swoop_id = '${swoopId}'`;
}

//flake smh
const deleteSquad = function(userId, swoopId, cb) {
  let query = `DELETE FROM squads WHERE user_id = ${userId} AND swoop_id = '${swoopId}'`;
  connection.query(query, (err, results) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, results);
    }
  });
}

//MYSQL QUERIES FOR:

// Businesses

// INSERT INTO businesses (name) VALUE ("Tu Lan");
// INSERT INTO businesses (name) VALUE ("Chipotle");
// INSERT INTO businesses (name) VALUE ("McDonalds");
// INSERT INTO businesses (name) VALUE ("Fancy Steak House");
// INSERT INTO businesses (name) VALUE ("Tempest");
// INSERT INTO businesses (name) VALUE ("Some Expensive Place");

//Users

// INSERT INTO users (name, email, password, username) VALUES ("Chris", "Chris@Chris.com", "Chris", "ChrisChris");
// INSERT INTO users (name, email, password, username) VALUES ("Kayleigh", "Kayleigh@Kayleigh.com", "Kayleigh", "Kayleigh");
// INSERT INTO users (name, email, password, username) VALUES ("Connor", "Connor@Connor.com", "Connor", "Connor");
// INSERT INTO users (name, email, password, username) VALUES ("Peter", "Peter@Peter.com", "Peter", "PeterPeterPumpkinEater");
// INSERT INTO users (name, email, password, username) VALUES ("Fred", "Fred@Fred.com", "Fred", "Fred");
// INSERT INTO users (name, email, password, username) VALUES ("Moises", "Moises@Chris.com", "BigCuddlyBear", "Weird");

//Reviews
//user_id, business_id, text

// INSERT INTO reviews (user_id, business_id, text) VALUES (1, 1, "this place is really tasty");
// INSERT INTO reviews (user_id, business_id, text) VALUES (2, 2, "this place sucks ass");
// INSERT INTO reviews (user_id, business_id, text) VALUES (3, 3, "this place could use better service");
// INSERT INTO reviews (user_id, business_id, text) VALUES (4, 4, "this place is pretty mediocre");
// INSERT INTO reviews (user_id, business_id, text) VALUES (5, 5, "this place is pretty good");
// INSERT INTO reviews (user_id, business_id, text) VALUES (6, 6, "this place is utter trash");

//CheckIns

// INSERT INTO checkins (user_id, business_id) VALUES (1, 1);
// INSERT INTO checkins (user_id, business_id) VALUES (2, 2);
// INSERT INTO checkins (user_id, business_id) VALUES (3, 3);
// INSERT INTO checkins (user_id, business_id) VALUES (4, 4);
// INSERT INTO checkins (user_id, business_id) VALUES (5, 5);
// INSERT INTO checkins (user_id, business_id) VALUES (6, 6);

//friends

// INSERT INTO checkins (user_id1, user_id2) VALUES (1, 2);
// INSERT INTO checkins (user_id1, user_id2) VALUES (1, 3);
// INSERT INTO checkins (user_id1, user_id2) VALUES (1, 4);
// INSERT INTO checkins (user_id1, user_id2) VALUES (1, 6);
// INSERT INTO checkins (user_id1, user_id2) VALUES (2, 3);
// INSERT INTO checkins (user_id1, user_id2) VALUES (2, 5);
// INSERT INTO checkins (user_id1, user_id2) VALUES (2, 6);
// INSERT INTO checkins (user_id1, user_id2) VALUES (3, 4);
// INSERT INTO checkins (user_id1, user_id2) VALUES (3, 5);
// INSERT INTO checkins (user_id1, user_id2) VALUES (3, 6);
// INSERT INTO checkins (user_id1, user_id2) VALUES (4, 6);
// INSERT INTO checkins (user_id1, user_id2) VALUES (5, 6);



//TEST FUNCTION CALLS

// connection.query(`SELECT * from USERS`, (err, results) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(results);
//     }
// })

// postUser({ name: "testName", email: "testEmail", password: "testPassword", username: "testUsername" }, (err, results) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(results)
//     }
// })

// getUserById(1, (err, results) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(results);
//     }
// })

// getBusinessById(1, (err, results) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(results);
//     }
// })


//connection.queries

module.exports = {
  connection,
  getUser,
  postUser,
  getHW,
  getUserInfo,
  getBusinessById,
  tempSearch,
  getStrangersReviews,
  getFriendsReviews,
  getYalpRatings,
  toggleFavorite,
  addCheckIn,
  checkCheckIn,
  checkFavorite,
  addNewReview,
  getUsernameById,
  getFavorite,
  getFriendsCheckins1,
  getFriendsCheckins2,
  addFriend,
  removeFriend,
  acceptFriend,
  friendChecker,
  getFriends,
  getCheckins,
  getReviews,
  getFavorites,
  checkUserExists,
  getAllReviews,
  getLoggedReviews,
  postDM,
  getChat,
  addSwoop,
  getSwoop,
  deleteSwoop,
  addSquad,
  deleteSquad
}
