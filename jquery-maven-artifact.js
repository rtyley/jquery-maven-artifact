(function($) {
  function downloadUrl(groupId, artifactId, version, type) {
    var groupPath = groupId.replace('.', '/');
    var artifactPath = artifactId.replace('.', '/');
    return 'http://repo1.maven.org/maven2/' + groupPath + '/' + artifactPath + '/' + version + '/' + artifactId + '-' + version + type;
  }

  $.fn.artifactVersion = function(groupId, artifactId, callback) {
    if (typeof(groupId) !== 'string' || typeof(artifactId) !== 'string') {
      console.log('Error: groupId and artifactId are required.');
      return;
    }
    if (typeof(callback) === 'undefined') {
      console.log('Error: callback function required.');
      return;
    }

    var url = 'http://search.maven.org/solrsearch/select/?q=g:"' + groupId + '"+AND+a:"' + artifactId + '"&wt=json&json.wrf=?';
    $.getJSON(url, function(response) {
      var versions = response.response.docs;
      var version = versions[0].latestVersion;
      var versionUrl = downloadUrl(groupId, artifactId, version, '.jar');
      callback(version, versionUrl);
    });
  };

  $.fn.artifactVersions = function(groupId, artifactId, callback) {
    if (typeof(groupId) !== 'string' || typeof(artifactId) !== 'string') {
      console.log('Error: groupId and artifactId are required.');
      return;
    }
    if (typeof(callback) === 'undefined') {
      console.log('Error: callback function required.');
      return;
    }

    var url = 'http://search.maven.org/solrsearch/select/?q=g:"' + groupId + '"+AND+a:"' + artifactId + '"&wt=json&rows=10&core=gav&json.wrf=?';
    $.getJSON(url, function(response) {
      var versions = response.response.docs;
      versions.sort(function(o1, o2) {
        return o1.v > o2.v ? -1 : 1;
      });
      var newVersions = [];
      for (var i = 0; i < versions.length; i++) {
        var version = versions[i].v;
        newVersions.push({
          name: version,
          url: downloadUrl(groupId, artifactId, version, '.jar')
        });
      }
      callback(newVersions);
    });
  }
})(jQuery);