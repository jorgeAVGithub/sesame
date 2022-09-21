import axios from 'axios'

export default {
    getRandomUsers:function() {
        return axios.get("https://randomuser.me/api/?results=1")
          .then(function (response) {
            return response
          })
          .catch(function (error) {
            return error
          });
    },

  getUserWorkStatus: function () {
    let params= {
      employeeId: "b99a6cd9-3a3d-4635-9eea-e089c90ac45a",
      orderBy: "updatedAt desc"
    }
    return axios.get("https://api-test.sesametime.com/schedule/v1/work-entries", 
    {
      headers: { Authorization: `Bearer 16e2f0694a311151c01aa0a131b94a5a3ad7f110e12c2d8f459fcbb158214f5f`},
      params: params
    }
    )
      .then(function (response) {
        return response
      })
      .catch(function (error) {
        return error
      });
  },

  postClockIn: function (userId) {
    var params = 
      {
      employeeId: userId,
        workEntryIn: {
        coordinates: {
          latitude: null,
          longitude: null
        }
      }
    }

    return axios("https://api-test.sesametime.com/schedule/v1/work-entries/clock-in", {
      method: "post",
      headers: { Authorization: `Bearer 16e2f0694a311151c01aa0a131b94a5a3ad7f110e12c2d8f459fcbb158214f5f` },
      data: params,
    })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        console.log(error);
        throw error
      })
  },

  postClockOut: function (userId) {
    var params =
    {
      employeeId: userId,
      workEntryIn: {
        coordinates: {
          latitude: null,
          longitude: null
        }
      }
    }
    return axios("https://api-test.sesametime.com/schedule/v1/work-entries/clock-out", {
      method: "post",
      headers: { Authorization: `Bearer 16e2f0694a311151c01aa0a131b94a5a3ad7f110e12c2d8f459fcbb158214f5f` },
      data: params,
    })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        console.log(error);
        throw error
      })
  },
    
}