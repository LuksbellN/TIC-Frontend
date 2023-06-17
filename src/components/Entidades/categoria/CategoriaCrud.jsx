import React, { Component } from "react";
import axios from "../../../main/axiosConfig";
import Main from "../../template/Main";

const headerProps = {
  icon: 'tags',
  title: 'Categorias',
  subtitle: 'Cadastro de categorias: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3333/api';

const initialState = {
  categoria: { id: '', nome_categoria: '' },
  list: [],
  token: ''
}

export default class CategoriaCrud extends Component {
  state = { ...initialState };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: 'Bearer ' + token
    }
    axios(baseUrl + '/categoria', {
      headers
    }).then(resp => {
      this.setState({ list: resp.data.data })
    });
  }

  clear() {
    this.setState({ categoria: initialState.categoria })
  }

  async save() {
    const token = localStorage.getItem("token");
    const categoria = this.state.categoria;
    const method = categoria.id !== '' ? 'patch' : 'post';
    const url = categoria.id !== '' ? `${baseUrl}/categoria/${categoria.id}` : baseUrl + '/categoria';
    await axios[method](url, categoria, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(async resp => {
        let list;
        if (method === 'post') {
          list = this.getUpdatedList(resp.data.data, true);
        } else {
          list = this.getUpdatedList({ ...categoria, ...resp.data });
        }
        this.setState({ categoria: initialState.categoria, list });
      });
  }

  getUpdatedList(categoria, add = true) {
    const list = this.state.list.filter(c => c.id !== categoria.id);
    if (add) list.unshift(categoria);
    return list
  }

  updateField(event) {
    const categoria = { ...this.state.categoria };
    categoria[event.target.name] = event.target.value;
    this.setState({ categoria });
  }

  load(categoria) {
    this.setState({ categoria });
  }

  async remove(categoria) {
    const token = localStorage.getItem("token");
    await axios.delete(`${baseUrl}/categoria/${categoria.id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(resp => {
      const list = this.getUpdatedList(categoria, false);
      this.setState({ list });
    });
  }

  renderForm() {
    const { categoria } = this.state;

    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input
                type="text"
                className="form-control"
                name="id"
                value={categoria.id}
                onChange={e => this.updateField(e)}
                placeholder="Digite o ID..."
                readOnly
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label htmlFor="nome_categoria">Nome da Categoria</label>
              <input
                type="text"
                className="form-control"
                name="nome_categoria"
                value={categoria.nome_categoria}
                onChange={e => this.updateField(e)}
                placeholder="Digite o nome da categoria..."
              />
            </div>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={async e => await this.save(e)}>
              Salvar
            </button>

            <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)} style={{ marginLeft: '8px' }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome da Categoria</th>
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
    if (this.state.list == null) return null
    return this.state.list.map(categoria => {
      return (
        <tr key={categoria.id}>
          <td>{categoria.id}</td>
          <td>{categoria.nome_categoria}</td>
          <td>
            <button className="btn btn-warning" onClick={e => this.load(categoria)}>
              <i className="fa fa-pencil"></i>
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
    )
  }
}
