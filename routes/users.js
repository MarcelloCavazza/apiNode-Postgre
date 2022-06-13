import express from 'express';
import pkg from 'pg';
import { v4 as uuidv4 } from 'uuid';
const { Client } = pkg;

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    password: 'root',
    port: 5432,
})
client.connect()

const router = express.Router();


router.get('/listUser', (request, response) => {
    client.query('SELECT userid, name, description FROM public."usersFromSystem";')
        .then((result) => {
            console.log(result.rows)
            response.send(result.rows)
        }).catch((err) => {
            response.send(err)
            console.log(err)
        });
});

router.get('/selectUser/:id', (request, response) => {
    let userIdToBeSelected = request.params

    client.query(`SELECT userid, name, description FROM public."usersFromSystem" where userid = '${userIdToBeSelected.id}';`)
        .then((result) => {
            console.log(result.rows)
            response.send(result.rows)
        }).catch((err) => {
            response.send(err)
            console.log(err)
        });
});

router.post('/createUser', (request, response) => {
    let dataToBeInserted = request.body
    dataToBeInserted.uiId = uuidv4()

    client.query(`INSERT INTO public."usersFromSystem"(userid, name, description) VALUES ('${dataToBeInserted.uiId}', '${dataToBeInserted.name}', '${dataToBeInserted.description}');`)
        .then((result) => {
            console.log(result.rows)
            response.send("Usuário criado!")
        }).catch((err) => {
            response.send(err)
            console.log(err)
        });
})

router.delete('/deleteUser/:id', (request, response) => {

    let userIdToBeDeleted = request.params
    client.query(`DELETE FROM public."usersFromSystem"
	WHERE userid = '${userIdToBeDeleted.id}';`)
        .then((result) => {
            console.log(result.rows)
            response.send("Usuario apagado!")
        }).catch((err) => {
            response.send(err)
            console.log(err)
        });
})

router.patch('/updateUser/:id', (request, response) => {
    let userIdToBeUpdated = request.params

    let dataToInsert = request.body
    let updateName = dataToInsert.name != null ? "name='" + dataToInsert.name + "'" : '';
    let updateDescription = '';
    if (updateName != null && dataToInsert.description != null) {
        updateDescription = dataToInsert.description != null ? ", description='" + dataToInsert.name + "' " : ''
    } else if (dataToInsert.description != null && updateName == null) {
        updateDescription = dataToInsert.description != null ? "description='" + dataToInsert.name + "' " : ''
    }

    console.log(`UPDATE public."usersFromSystem" SET ${updateName} ${updateDescription} WHERE userid = '${userIdToBeUpdated.id}';`)
    if (updateDescription != '' && updateName != '') {
        client.query(`UPDATE public."usersFromSystem" SET ${updateName} ${updateDescription} WHERE userid = '${userIdToBeUpdated.id}';`)
            .then((result) => {
                console.log(result.rows)
                response.send("Usuario atualizado!")
            }).catch((err) => {
                response.send(err)
                console.log(err)
            });
    } else {
        console.log("sem dados")
        response.send("sem dados")
    }
})

export default router;