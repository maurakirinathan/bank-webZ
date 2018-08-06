const  client = require("./cassandrainfo")

/*
 * GET pending trans listing.
 */
exports.list = function (req, res) {

    console.log('allblocks: list');
    client.execute('SELECT id,bank,promize_amount,from_account,to_account,timestamp FROM trans  LIMIT 10', [], function (err, result) {
        if (err) {
            console.log('pending trans: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('processing Transaction transaction: list succ:', result.rows);
            res.render('processingTransaction', {page_title: "Processing Transactions", data: result.rows})
        }
    });

};

/*
 * GET one pending trans.
 */
exports.list_one = function (req, res) {

    var id = req.params.id;
    console.log('trans: viewing one');

    client.execute("SELECT id,bank,promize_amount,promize_bank,from_account,to_account,type,from_zaddress,to_zaddress,timestamp from trans WHERE id = " + id + " ALLOW FILTERING", [], function (err, result) {
        if (err) {
            console.log('trans: viewing one err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('processing Transaction View One: viewing one succ:');
            res.render('processingTransactionViewOne', {page_title: "Processing Transactions Details", data: result.rows});
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
    console.log('pending trans: list_search');
    if (validate(input.id)) {
        client.execute("SELECT id,bank,promize_amount,from_account,to_account,timestamp from trans WHERE id = " + input.id + " ALLOW FILTERING", [], function (err, result) {
            if (err) {
                console.log('pending trans: search one err:', err);
                res.status(404).send({msg: err});
                res.render('trans', {page_title: "trans Details",});
                //  allblocks();
            } else {
                console.log('processing Transaction: search one succ:');
                res.render('processingTransaction', {page_title: "Processing Transactions Details", data: result.rows});
            }
        });
    }
    else
    {
        var result=[];
        res.render('processing Transaction', {page_title: "Transaction Details", data:result});

    }
};

/*
 * GET cheques listing pagging next.
 */
exports.list_paging_next = function (req, res) {

    console.log('pendingTransaction: list');
    var id = req.params.id;

    console.log('id:  ' +id );
    client.execute("SELECT id,bank,promize_amount,from_account,to_account,timestamp FROM trans WHERE id < "+ id + "LIMIT 10 ALLOW FILTERING", [], function (err, result) {
        if (err) {""
            console.log('pendingTransaction: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('processing Transaction: list succ:', result.rows);
            res.status(200).send(result.rows);
        //    res.render('processingTransaction', {page_title: "Processing Transactions", data: result.rows})

        }
    });

};

/*
 * GET cheques listing pagging previous.
 */
exports.list_paging_previous = function (req, res) {

    console.log('pendingTransaction: list');
    var id = req.params.id;
    console.log('id:', id);
    client.execute("SELECT id,bank,promize_amount,from_account,to_account,timestamp FROM trans WHERE expr(trans_lucene_index," +"\'{ sort: [ {type: \"simple\", field: \"id\", reverse: true} ] }"+"\') AND bank='sampath' AND id <"+ id + " LIMIT 10 ALLOW FILTERING", [], function (err, result) {
        if (err) {""
            console.log('pendingTransaction: list err:', err);
            res.status(404).send({msg: err});
        } else {
            console.log('processing Transaction: list succ:', result.rows);
            res.render('processingTransaction', {page_title: "Processing Transactions", data: result.rows})
        }
    });

};
