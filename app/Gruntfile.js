module.exports = function(grunt) {

  grunt.initConfig({
    nodewebkit: {
      options: {
        app_name: "SSIDCheckin",
        mac_icns: "./terminal.icns",
        build_dir: './build', // Where the build version of my node-webkit app is saved
        mac: true, // We want to build it for mac
        win: false, // We want to build it for win
        linux32: false, // We don't need linux32
        linux64: false, // We don't need linux64
      },
      src: './**/*' // Your node-webkit app
    },
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['nodewebkit']);

};