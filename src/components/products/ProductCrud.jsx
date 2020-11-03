import React, { Component } from "react";
import axios from 'axios';
import Main from "../template/Main";
// import { useParams } from 'react-router';

const headerProps = {
  icon: "shopping-cart",
  title: "Produtos",
  subtitle: "Cadastro de produtos: Incluir, Listar, Alterar e Excluir !",
};

const baseUrl = 'http://localhost:3001/products'
const initialState = {
    product: { name: '', quantity: '', unitPrice: ''},
    list: []
}

export default class ProductCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState ( { product: initialState.product });
    }

    save() {
        const product = this.state.product;
        const method = product.id ? 'put' : 'post' // put altera e post inclui
        const url = product.id ? `${baseUrl}/${product.id}` : baseUrl
        axios[method] (url, product)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ product: initialState.product, list })
            })
    }

    getUpdatedList(product, add = true) {
        const list = this.state.list.filter( p => p.id !== product.id )
        if(add) list.unshift(product)  // unshift coloca aquele elemento no início da lista
        return list;
    }
    
    updateField(event) {
        const product = { ...this.state.product }
        product[event.target.name] = event.target.value
        this.setState({ product })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.product.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..."
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Quantidade</label>
                            <input type="text" className="form-control"
                                name="quantity"
                                value={this.state.product.quantity}
                                onChange={e => this.updateField(e)}
                                placeholder="Quantidade ..."
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Preço Unitário</label>
                            <input type="text" className="form-control"
                                name="unitPrice"
                                value={this.state.product.unitPrice}
                                onChange={e => this.updateField(e)}
                                placeholder="Preço Unitário ..."
                            />
                        </div>
                    </div>
                </div>

                <hr/>
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(product) {
        this.setState({ product })
    }

    remove(product) {
        axios.delete(`${baseUrl}/${product.id}`).then(resp => {
            const list = this.getUpdatedList(product, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Preço Unitário</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(product => {
            return (
                <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.unitPrice}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(product)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(product)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

  render() {
    return (
        <Main {...headerProps}>
            {this.renderForm()}
            {this.renderTable()}
        </Main>
        );
  }
}
