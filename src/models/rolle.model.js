var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Role", // Will use table name `category` as default behaviour.
    tableName: "role", // Optional: Provide `tableName` property to override the default behaviour for table name. 
    columns: {
        idRol: {
            name:'id_rol',
            primary: true,
            type: "int",
            generated: true,
        },
        name:{
            name:'name',
            type:'varchar',
            nullable:false
        },
        description: {
            name:"description",
            type: "varchar",
            length:255,
            nullable:false,
        },
        state:{
            type:"varchar",
            nullable:false,
        },
 
    },

});