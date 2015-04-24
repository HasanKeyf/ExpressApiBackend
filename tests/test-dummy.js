var fs =  require('fs');


describe("Simple tests", function() {

    it('check if dummy file exists', function(done) {

        fs.open('dummy',1, function (err,file) {
            if (err) {
                done(new Error('File doesn\'t exist'))
            }else{
                done(null);
            }


        });

    })

})