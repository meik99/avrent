module.exports = function(orm){
    var description= {
        variables: {
            equipmentId: {type: "text"},
            clazzId: {type: "text"},
            pupil: {type: "text"},
            date_from: {type: "date"},
            date_to: {type: "date"}
        },
        options: {
            methods: {},
            validations: {
                equipmentId: [orm.enforce.required()],
                clazzId: [orm.enforce.required()],
                pupil: [orm.enforce.required()],
                date_from: [orm.enforce.required()],
                date_to: [orm.enforce.required()]
            }
        }
    }
    return description;
};