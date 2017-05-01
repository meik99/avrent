module.exports = function(orm){
    var description= {
        variables: {
            equipmentName: {type: "text"},
            clazzName: {type: "text"},
            pupil: {type: "text"},
            date_from: {type: "date"},
            date_to: {type: "date"}
        },
        options: {
            methods: {},
            validations: {
                equipmentName: [orm.enforce.required()],
                clazzName: [orm.enforce.required()],
                pupil: [orm.enforce.required()],
                date_from: [orm.enforce.required()],
                date_to: [orm.enforce.required()]
            }
        }
    }
    return description;
};