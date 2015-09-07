var recordAPI='https://tkxssqi21g.execute-api.us-west-2.amazonaws.com/prod/record';
var pollInterval=2000;

var Record = React.createClass({
  handleDelete: function(e) {
    e.preventDefault();
    var key = React.findDOMNode(this.refs.id).id.trim();
    $.ajax({
      url: recordAPI+"/"+key,
      dataType: 'json',
      type: 'DELETE',
//      data: JSON.stringify(d),
      success: function(data) {
        console.log("DELETE result:" + data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(recordAPI, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="record">
        <input type="button" id={this.props.id + "|" + this.props.create_time} ref="id" value="Delete"
               onClick={this.handleDelete} />
        {this.props.create_time} @{this.props.at} / {this.props.name} / {this.props.price}
      </div>
    );
  }
});

var RecordList = React.createClass({
  render: function() {
    var data = this.props.data.Items
    if (!data) {
       // initial
       return (
          <div className="recordList"></div>
       );
    }
    var recordNodes = data.map(function (r) {
      return (
        <Record key={r.id} id={r.id} name={r.name} price={r.price} at={r.at} create_time={r.create_time} />
      );
    });
    return (
      <div className="recordList">
        {recordNodes}
      </div>
    );
  }
});

var RecordForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var name = React.findDOMNode(this.refs.name).value.trim();
    var price = React.findDOMNode(this.refs.price).value.trim();
    var at = React.findDOMNode(this.refs.at).value.trim();
    if (!name || !price || !at) {
      return;
    }
    this.props.onRecordSubmit({name: name, price: price, at: at});
    React.findDOMNode(this.refs.name).value = '';
    React.findDOMNode(this.refs.price).value = '';
    React.findDOMNode(this.refs.at).value = '';
    return;
  },
  render: function() {
    return (
      <form className="recordForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Where?" ref="at" />
        <input type="text" placeholder="What?" ref="name" />
        <input type="text" placeholder="How much?" ref="price" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var RecordBox = React.createClass({
  loadRecordsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleRecordSubmit: function(r) {
    var d = {
      "name": r.name,
      "price": r.price,
      "at": r.at
    }
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(d),
      success: function(data) {
        console.log("POST result:" + data);
        this.loadRecordsFromServer();
        //this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadRecordsFromServer();
    setInterval(this.loadRecordsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="recordBox">
        <h1>Records</h1>
        <RecordForm onRecordSubmit={this.handleRecordSubmit} />
        <RecordList data={this.state.data} />
      </div>
    );
  }
});

React.render(
  <RecordBox url={recordAPI} pollInterval={pollInterval} />,
  document.getElementById('recordArea')
);

