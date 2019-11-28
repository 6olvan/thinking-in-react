import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


const DATA = [
    { id: 1, category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
    { id: 2, category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
    { id: 3, category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
    { id: 4, category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
    { id: 5, category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
    { id: 6, category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"},
    { id: 7, category: "Electronics", price: "$199.99", stocked: true, name: "Base 7"}
];

class ParamNormalizer {
    static inputValue(fn) {
        return function (event) {
            fn(event.target.value)
        }
    }

    static checkboxValue(fn) {
        return function (event) {
            fn(event.target.checked)
        }
    }
}

class GoodsFetcher {
    findByCategory(categoryName) {
        return DATA.filter((item) => item.category === categoryName );
    }

    findCategories() {
        return ["Electronics", "Sporting Goods"];
    }

    search(categoryName, name, inStock) {
        return DATA.filter((item) => {
            return item.category === categoryName
                    && (name && item.name.toLowerCase().indexOf(name.toLowerCase()) == 0 || !name)
                    && item.stocked === inStock;
        })
    }
}

function TwoColRow(props) {
    return (
        <div className="two-col-row clearfix">
            <div className="left-col">{props.leftText}</div>
            <div className="right-col">{props.rightText}</div>
        </div>
    )
}

function ListTwoColRow(props) {
    const list = props.list.map((item) => {
        return <TwoColRow key={item.id} leftText={item.name} rightText={item.price}/>
    });

    return list;
}

function SearchInput(props) {
    return <input type="text"  onChange={ParamNormalizer.inputValue(props.onSearch)} placeholder="Search"/>
}

function Checkbox(props) {
    return (
        <label htmlFor="in_stock">
            Only show products in stock
            <input type="checkbox" onChange={ParamNormalizer.checkboxValue(props.onChange)}  id={'in_stock'}/>
        </label>
    )
}

class SearchBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {searchValue: '', inStock: false};
        this.onSearchInput = this.onSearchInput.bind(this);
        this.onChangeStock = this.onChangeStock.bind(this);
    }

    onSearchInput(value) {
        this.setState({searchValue: value}, this.onSearch);
    }

    onChangeStock(checked) {
        this.setState({inStock: checked}, this.onSearch);
    }

    onSearch() {
        this.props.onSearch(this.state.searchValue, this.state.inStock);
    }

    render() {
        return (
            <div className="search">
                <SearchInput onSearch={this.onSearchInput}/>
                <br/>
                <Checkbox onChange={this.onChangeStock}/>
            </div>
        );
    }
}

class SearchPage extends React.Component {
    constructor(props) {
        super(props);

        this.fetcher = new GoodsFetcher();
        this.initState();
        this.initDefaultFetchers();
        this.onSearch = this.onSearch.bind(this);
    }

    getCategories() {
       return this.fetcher.findCategories();
    }

    initState() {
        this.state = this.getCategories().reduce((acc, categoryName) => {
            acc[categoryName] = [];

            return acc;
        }, []);
    }

    initDefaultFetchers()
    {
        this.defaultFetchers = [];

        this.getCategories().map((categoryName) => {
            this.defaultFetchers.push(() => {
                this.setState({
                    [categoryName]: this.fetcher.findByCategory(categoryName)
                })
            });
        })
    }

    onSearch(searchValue, inStock) {
        this.getCategories().map((categoryName) => {
            this.setState({
                [categoryName]: this.fetcher.search(categoryName, searchValue, inStock)
            });
        });
    }

    componentDidMount() {
        this.defaultFetchers.map((fetcher) => fetcher());
    }

    render() {
        const rows = this.getCategories().map((categoryName) => {
            return (
                <>
                    <p>{categoryName}</p>
                    <ListTwoColRow list={this.state[categoryName]} />
                </>
            )
        });

        return (
            <div>
                <SearchBox onSearch={this.onSearch} />
                <div className="results">
                    <TwoColRow leftText="Name" rightText="Price"/>
                    {rows}
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <div>
        <br/>
        <br/>
        <br/>
        <center>
            <div className="main">
                <SearchPage />
            </div>
        </center>
    </div>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
