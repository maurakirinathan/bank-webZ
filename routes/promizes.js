const  client = require("./cassandrainfo")

/*
 * GET cheques listing pagging next.
 */
exports.list_paging_next = function (req, res) {

    console.log('allcheques: list');
    var id = req.params.id;

    console.log('id:  ' +id );
    client.execute("SELECT  id,bank,amount FROM promizes WHERE id < "+ id + "LIMIT 10 ALLOW FILTERING", [], function (err, result) {
        if (err) {""
            console.log('allcheques: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('allcheques1: list succ:', result.rows);
            res.status(200).send(result.rows);
           // res.render('allcheques', {page_title: "All Cheques", data: result.rows})

        }
    });

};

/*
 * GET cheques listing pagging previous.
 */
/*exports.list_paging_previous = function (req, res) {

   console.log('allcheques: list');
    var id = req.params.id;
      console.log('id:', id);
    client.execute("SELECT * FROM cheques WHERE expr(cheque_lucene_index," +"\'{ sort: [ {type: \"simple\", field: \"id\", reverse: true} ] }"+"\') AND bank='sampath' AND id <"+ id + " LIMIT 10 ALLOW FILTERING", [], function (err, result) {
        if (err) {""
            console.log('allcheques: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('allcheques2: list succ:', result.rows);
            res.render('allcheques', {page_title: "All Cheques", data: result.rows})
        }
    });

};*/
//SELECT * FROM cheques WHERE expr(cheque_lucene_index, '{ sort: [ {type: "simple", field: "id", reverse: true} ] }') AND bank='sampath' AND id < 4f3211e0-1b82-11e8-b813-6d2c86545d91 LIMIT 2 ;

//SELECT * FROM cheques WHERE expr(cheque_lucene_index, '{ sort: [ {type: "simple", field: "id", reverse: true} ] }') AND bank='sampath' AND id < 7a22c8be-0407-11e8-ba89-0ed5f89f718b LIMIT 2 ;

/*
 * GET cheques listing .
 */
exports.list = function (req, res) {

    console.log('allcheques: list');
    client.execute('SELECT id,bank,amount FROM promizes LIMIT 10', [], function (err, result) {
        if (err) {
            console.log('allpromizes: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('allpromizes: list succ:', result.rows);
            res.render('allpromizes', {page_title: "All Promizes", data: result.rows})
        }
    });
};

/*
 * GET one cheque detail.
 */
exports.list_one = function (req, res) {

    var id = req.params.id;
    console.log('promizes: viewing one');

    client.execute("SELECT id,bank,amount,origin_zaddress from promizes WHERE id = " + id + " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            console.log('promizes: viewing one err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('promizes: viewing one succ:');
            res.render('promizesViewOne', {page_title: "Promizes Details", data: result.rows});
        }
    });

};


/*
 * GET one block.
 */
exports.list_search = function (req, res) {

    // var id = req.params.id;
    var input = JSON.parse(JSON.stringify(req.body));

    var validate = require('uuid-validate');


    console.log(input);
    console.log('promizes: list_search');
    if (validate(input.id)) {
        client.execute("SELECT id,bank,amount from promizes WHERE id = " + input.id + " ALLOW FILTERING", [], function (err, result) {
            if (err) {
                console.log('promizes: search one err:', err);
                res.status(404).send({msg: err});
                res.render('allpromizes', {page_title: "Promizes Details",});
                //  allblocks();
            } else {
                console.log('promizes: search one succ:');
                res.render('allpromizes', {page_title: "Promizes Details", data: result.rows});
            }
        });
    }
    else
    {
        var result=[];
        res.render('allpromizes', {page_title: "Promizes Details", data:result});
    }
};

exports.transactions_for_promize = function (req, res) {

    var id = req.params.id;
    client.execute("select id,bank,promize_amount,from_account,to_account,timestamp from transactions where promize_id=" +id+ " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            console.log('alltransaction_promize: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('alltransaction_promize: list succ:', result.rows);
            res.render('alltransaction_promize', {page_title: "All Transactions", data: result.rows})
        }
    });

};

/*exports.transactions_for_promize = function (req, res) {

    console.log('alltrans: list');
    client.execute('SELECT * FROM transactions  LIMIT 10', [], function (err, result) {
        if (err) {
            console.log('alltransaction_promize: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('alltransaction_promize: list succ:', result.rows);
            res.render('alltransaction_promize', {page_title: "All Transactions", data: result.rows})
        }
    });

};*/

//SELECT * FROM cheques where token(bank_id) > token('test4') LIMIT  2;
