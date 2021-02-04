const { joinClassroom } = require('./join.service');

module.exports = {

    joinClass: (req, res) =>{

        joinClassroom(req.body).then ((result) =>{

            if(!result){

                res.status(500);
                return res.json({
                    success: 0,
                    message: "Error occured while joining Classroom"
                });
            }

            res.status(200);

            return res.json({
                success: 1,
                message: "Classroom joined!"
            });
        })

        .catch((e) =>{
            res.status(e.status);
            res.send(e);
            res.end();
        });
    },
};