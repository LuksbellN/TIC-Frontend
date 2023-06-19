import React, { Component } from 'react';
import axios from '../../../main/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Main from '../../template/Main';

const headerProps = {
    icon: 'home',
    title: 'Detalhes do Patrimônio',
    subtitle: 'Visualização e Edição de Patrimônio',
};

class PatrimonioDetails extends Component {

    state = {
        patrimonio: {
            tipo: '',
            id_departamento: '',
            id_categoria: '',
            id_fornecedor: '',
            nome: '',
            data_aquisicao: '',
            estado: '',
            valor: '',
            nome_doador: '',
            telefone: '',
            placa: '',
            imagem_url: '',
        },
        categorias: [],
        departamentos: [],
        fornecedores: [],
        imagem: null
    };

    componentDidMount() {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer ' + token,
        };

        const { id } = this.props.match.params;

        this.fetchPatrimonio(id, headers);
        this.fetchCategorias(headers);
        this.fetchDepartamentos(headers);
        this.fetchFornecedor(headers);
    }

    fetchPatrimonio(id, headers) {
        axios
            .get(`http://localhost:3333/api/patrimonio/${id}`, { headers })
            .then((res) => {
                this.assignTipo(res.data.data);
                this.setState({ patrimonio: { ...res.data.data, data_aquisicao: this.convertDate(res.data.data.data_aquisicao) } });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    assignTipo(patrimonio) {
        if (patrimonio.placa) {
            patrimonio.tipo = 'pref';
        } else if (patrimonio.valor) {
            patrimonio.tipo = 'adq';
        } else if (patrimonio.nome_doador) {
            patrimonio.tipo = 'doa';
        }
    }

    convertDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

        return formattedDate;
    }

    fetchCategorias(headers) {
        axios
            .get('http://localhost:3333/api/categoria', { headers })
            .then((res) => {
                this.setState({ categorias: res.data.data });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    fetchDepartamentos(headers) {
        axios
            .get('http://localhost:3333/api/departamento', { headers })
            .then((res) => {
                this.setState({ departamentos: res.data.data });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    fetchFornecedor(headers) {
        axios
            .get('http://localhost:3333/api/fornecedor', { headers })
            .then((res) => {
                this.setState({ fornecedores: res.data.data });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    updateCategoria(event) {
        this.setState({
            patrimonio: {
                ...this.state.patrimonio,
                id_categoria: event.target.value,
            },
        });
    }

    updateDepartamento(event) {
        this.setState({
            patrimonio: {
                ...this.state.patrimonio,
                id_departamento: event.target.value,
            },
        });
    }

    updateFornecedor(event) {
        this.setState({
            patrimonio: {
                ...this.state.patrimonio,
                id_fornecedor: event.target.value,
            },
        });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            patrimonio: {
                ...this.state.patrimonio,
                [name]: value,
            },
        });
    };


    handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('token');

        await axios
            .post('http://localhost:3333/api/upload', formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then((res) => {
                this.setState({
                    patrimonio: {
                        ...this.state.patrimonio,
                        imagem_url: res.data.data,
                    },
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { id } = this.props.match.params;
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer ' + token,
        };
        console.log(this.state.patrimonio);
        await axios
            .put(`http://localhost:3333/api/patrimonio/${id}`, { ...this.state.patrimonio, data_aquisicao: "" }, { headers })
            .then((res) => {
                console.log(res.data)
                if (res.data.sucesso == true) {
                    this.props.navigate('/patrimonios')
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        const {
            tipo,
            id_departamento,
            id_categoria,
            id_fornecedor,
            nome,
            data_aquisicao,
            estado,
            valor,
            placa,
            nome_doador,
            telefone,
            imagem_url,
        } = this.state.patrimonio;

        const { categorias, departamentos, fornecedores } = this.state;

        return (
            <Main {...headerProps}>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={e => this.handleSubmit(e)}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Nome</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            name="nome"
                                            value={nome || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Departamento</label>
                                        <select
                                            className="form-control form-control-lg"
                                            value={id_departamento || ''}
                                            onChange={e => this.updateDepartamento(e)}
                                        >
                                            {departamentos.map((departamento) => (
                                                <option key={departamento.id} value={departamento.id || ''}>
                                                    {departamento.nome_departamento}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Categoria</label>
                                        <select
                                            className="form-control form-control-lg"
                                            value={id_categoria || ''}
                                            onChange={e => this.updateCategoria(e)}
                                        >
                                            {categorias.map((categoria) => (
                                                <option key={categoria.id} value={categoria.id}>
                                                    {categoria.nome_categoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Fornecedor</label>
                                        <select
                                            className="form-control form-control-lg"
                                            value={id_fornecedor || ''}
                                            onChange={e => this.updateFornecedor(e)}
                                        >
                                            {fornecedores.map((fornecedor) => (
                                                <option key={fornecedor.id} value={fornecedor.id}>
                                                    {fornecedor.nome_fornecedor}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Data de Aquisição</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            name="data_aquisicao"
                                            value={data_aquisicao || ''}
                                            onChange={e => this.handleChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Estado:</label>
                                        <select
                                            className="form-control form-control-lg"
                                            name="estado"
                                            value={estado || '3'}
                                            onChange={this.handleChange}
                                            required
                                        >
                                            <option value="1">1 - Péssimo</option>
                                            <option value="2">2 - Ruim</option>
                                            <option value="3">3 - Regular</option>
                                            <option value="4">4 - Bom</option>
                                            <option value="5">5 - Ótimo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {(tipo === 'adq') && (
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Valor</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="valor"
                                                value={valor}
                                                onChange={e => this.handleChange(e)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            {tipo === 'pref' && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Valor</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="valor"
                                                value={valor || ''}
                                                onChange={e => this.handleChange(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Placa</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="placa"
                                                value={placa || ''}
                                                onChange={e => this.handleChange(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {tipo === 'doa' && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Nome do Doador</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="nome_doador"
                                                value={nome_doador || ''}
                                                onChange={e => this.handleChangeDoa(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Telefone</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="telefone"
                                                value={telefone || ''}
                                                onChange={e => this.handleChangeDoa(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {imagem_url && (
                                <div className="row mt-4">
                                    <div className="col-md-12">
                                        <img src={imagem_url} alt='patrimonioImage' style={{ maxWidth: '25%', height: 'auto' }} />
                                    </div>
                                </div>
                            )}
                            <div className="row mt-4 mb-4">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Imagem       .</label>
                                        <input
                                            type="file"
                                            className="form-control-file form-control-lg"
                                            accept="image/*"
                                            onChange={e => this.handleImageUpload(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        value={tipo || ''}
                                        disabled
                                        hidden
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg">
                                Salvar
                            </button>
                            <button
                                className="btn btn-secondary btn-lg ms-2"
                                onClick={() => this.props.navigate('/patrimonios')}
                            >
                                Voltar
                            </button>
                        </form>
                    </div>
                </div>
            </Main>
        );
    }
}


export default function PatrimonioDetailsWrapper() {
    const navigate = useNavigate();
    const params = useParams();

    return <PatrimonioDetails navigate={navigate} match={{ params }} />;
}