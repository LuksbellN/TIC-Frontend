import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../../../main/axiosConfig";
import Main from "../../template/Main";

const headerProps = {
    icon: 'home',
    title: 'Patrimônio',
    subtitle: 'Consulta de Patrimônios'
};


const initialState = {
    patrimonios: [],
    categorias: [],
    departamentos: [],
    tipo: '',
    categoria: '',
    departamento: '',
    dataInicio: '',
    dataFim: '',
    consulta: '',
    origem: {
        prefeitura: false,
        doacao: false,
        adquirido: false
    }
};

class PatrimonioCrud extends Component {
    state = { ...initialState };

    componentDidMount() {
        const token = localStorage.getItem("token");
        const headers = {
            Authorization: 'Bearer ' + token
        }

        this.fetchCategorias(headers);
        this.fetchDepartamentos(headers);
    }

    fetchCategorias(headers) {
        axios
            .get('http://localhost:3333/api/categoria', { headers })
            .then(res => {
                this.setState({ categorias: res.data.data });
            })
            .catch(error => {
                console.error(error);
            });
    }

    fetchDepartamentos(headers) {
        axios
            .get('http://localhost:3333/api/departamento', { headers })
            .then(res => {
                this.setState({ departamentos: res.data.data });
            })
            .catch(error => {
                console.error(error);
            });
    }

    updateCategoria(event) {
        this.setState({ categoria: event.target.value });
    }

    updateDepartamento(event) {
        this.setState({ departamento: event.target.value });
    }

    updateDataInicio(event) {
        this.setState({ dataInicio: event.target.value });
    }

    updateDataFim(event) {
        this.setState({ dataFim: event.target.value });
    }
    updateConsulta(e) {
        this.setState({
            consulta: e.target.value
        });
    }

    handleOrigemChange(event) {
        const { name, checked } = event.target;
        this.setState(prevState => ({
            origem: {
                ...prevState.origem,
                [name]: checked
            }
        }));
    }

    handleCreateClick() {
        const navigate = this.props.navigate;
        navigate('/patrimonio/criar');
    }

    async remove(patrimonio) {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3333/api/patrimonio/${patrimonio.id}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(resp => {
            const pats = this.state.patrimonios;
            this.setState({ patrimonios: pats.filter(p => p.id !== resp.data.data.id) });
        })
    }


    search() {
        const token = localStorage.getItem("token");
        const headers = {
            Authorization: 'Bearer ' + token
        }
        const { origem, categoria, departamento, dataInicio, dataFim, consulta } = this.state;

        let tipo = '';
        if (origem.prefeitura) {
            tipo += 'pref-';
        }
        if (origem.doacao) {
            tipo += 'doa-';
        }
        if (origem.adquirido) {
            tipo += 'adq-';
        }

        if (tipo.length > 0) {
            // Removendo o último hífen do tipo
            tipo = tipo.slice(0, -1);
        }

        let queryParams = '';
        if (tipo) {
            queryParams += `tipo=${tipo}&`;
        }
        if (categoria) {
            queryParams += `categoria=${categoria}&`;
        }
        if (departamento) {
            queryParams += `departamento=${departamento}&`;
        }
        if (dataInicio) {
            queryParams += `data_inicio=${dataInicio}&`;
        }
        if (dataFim) {
            queryParams += `data_fim=${dataFim}&`;
        }
        if (consulta) {
            queryParams += `consulta=${consulta}&`;
        }

        // Removendo o último caractere "&" se existir
        if (queryParams.endsWith('&')) {
            queryParams = queryParams.slice(0, -1);
        }

        function convertDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

            return formattedDate;
        }


        // Fazer a requisição com os parâmetros de filtro
        const url = `http://localhost:3333/api/patrimonio?${queryParams}`;
        axios
            .get(url, { headers })
            .then(res => {
                const lista = res.data.data.map(e => {
                    return {
                        ...e,
                        data_aquisicao: convertDate(e.data_aquisicao),
                        nome_departamento: e.departamento.nome_dpto,
                        nome_categoria: e.categoria.desc_categoria
                    };
                });
                this.setState({ patrimonios: lista });
            })
            .catch(error => {
                console.error(error);
            });
    }

    renderFilters() {
        const { categorias, departamentos, origem } = this.state;

        return (
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>Origem:</label>
                            <div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="prefeitura"
                                        checked={origem.prefeitura}
                                        onChange={e => this.handleOrigemChange(e)}
                                    />
                                    <label className="form-check-label">Prefeitura</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="doacao"
                                        checked={origem.doacao}
                                        onChange={e => this.handleOrigemChange(e)}
                                    />
                                    <label className="form-check-label">Doação</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="adquirido"
                                        checked={origem.adquirido}
                                        onChange={e => this.handleOrigemChange(e)}
                                    />
                                    <label className="form-check-label">Adquirido</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>Categoria:</label>
                            <select
                                className="form-control"
                                value={this.state.categoria}
                                onChange={e => this.updateCategoria(e)}
                            >
                                <option value="">Selecione uma categoria</option>
                                {categorias.map(categoria => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nome_categoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>Departamento:</label>
                            <select
                                className="form-control"
                                value={this.state.departamento}
                                onChange={e => this.updateDepartamento(e)}
                            >
                                <option value="">Selecione um departamento</option>
                                {departamentos.map(departamento => (
                                    <option key={departamento.id} value={departamento.id}>
                                        {departamento.nome_departamento}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>Data Início:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={this.state.dataInicio}
                                onChange={e => this.updateDataInicio(e)}
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="form-group">
                            <label>Data Fim:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={this.state.dataFim}
                                onChange={e => this.updateDataFim(e)}
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="row">
                            <div>
                                <div className="form-group">
                                    <label>Busca:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.consulta}
                                        onChange={e => this.updateConsulta(e)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group mt-4 text-end">

                            <button className="btn btn-primary btn-lg" onClick={() => this.search()}>
                                Buscar
                            </button>
                            <button className="btn btn-success btn-lg ms-2" onClick={() => this.handleCreateClick()}>
                                + Novo
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        );
    }

    renderTable() {
        const { patrimonios, origem } = this.state;
        // colunas padrao
        const columns = [
            { name: 'id', label: 'ID' },
            { name: 'nome', label: 'Nome' },
            { name: 'data_aquisicao', label: 'Data Aquisição' },
            { name: 'nome_departamento', label: 'Departamento' },
            { name: 'nome_categoria', label: 'Categoria' },
            { name: 'estado', label: 'Estado' }
        ];

        if (origem.prefeitura || origem.adquirido) {
            columns.push({ name: 'valor', label: 'Valor' });
        }

        if (origem.prefeitura) {
            columns.push({ name: 'placa', label: 'Placa' });
        }

        if (origem.doacao) {
            columns.push({ name: 'nomeDoador', label: 'Nome Doador' });
            columns.push({ name: 'telefone', label: 'Telefone Doador' });
        }

        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        {columns.map(column => (
                            <th key={column.name}>{column.label}</th>
                        ))}
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {patrimonios.map(patrimonio => (
                        <tr key={patrimonio.id}>
                            {columns.map(column => (
                                <td key={column.name}>{patrimonio[column.name]}</td>
                            ))}
                            <td>
                                <button
                                    className="btn btn-warning"
                                    onClick={() => this.remove(patrimonio)}
                                >
                                    <i className="fa fa-pencil"></i>
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => this.remove(patrimonio)}
                                    style={{ marginLeft: '4px' }}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderFilters()}
                {this.renderTable()}
            </Main>
        );
    }
}

export default function PatrimonioCrudWrapper(props) {
    const navigate = useNavigate();

    return <PatrimonioCrud {...props} navigate={navigate} />;
}