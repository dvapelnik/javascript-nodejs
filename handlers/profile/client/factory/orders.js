module.exports = ($resource) => {
  return $resource('/payments/common/orders/user/' + window.currentUser.id, {}, {
    query: {
      method:            'GET',
      isArray:           true,
      transformResponse: function(data, headers) {
        data = JSON.parse(data);
        data.forEach(function(order) {
          order.created = new Date(order.created);

          order.countDetails = {
            free:     order.count - order.participants.length,
            busy:     order.participants.length,
            accepted: order.participants.filter(function(participant) {
              return participant.accepted;
            }).length
          };

        });

        return data;
      }
    }
  });
};