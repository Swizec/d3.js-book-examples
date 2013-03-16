
window.helpers = {
    uniques: function (data, nick) {
        var uniques = [];
        
        data.forEach(function (d) {
            if (uniques.indexOf(nick(d)) < 0) {
                uniques.push(nick(d));
            }
        });

        return uniques;
    }, 

    bin_per_nick: function (data, nick) {
        var uniques = helpers.uniques(data, nick);
        
        var nick_id = d3.scale.ordinal().domain(uniques).range(d3.range(uniques.length));
        
        var histogram = d3.layout.histogram()
                .bins(nick_id.range())
                .value(function (d) { return nick_id(nick(d)); })(data);
        
        return histogram;
    },

    tickAngle: function (d) {
        var midAngle = (d.endAngle-d.startAngle)/2,
            degrees = (midAngle+d.startAngle)/Math.PI*180-90;

        return degrees;
    }
};
