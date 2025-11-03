app.service('$service', function ($http) {
    var baseUrl = 'https://localhost:7277';

    // Hàm GET
    this.get = function (url) {
        return $http.get(baseUrl + url);
    };

    // Hàm POST
    this.post = function (url, data) {
        return $http.post(baseUrl + url, data);
    };

    // Hàm DELETE
    this.delete = function (url) {
        return $http.delete(baseUrl + url);
    };
});