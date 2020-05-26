import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
} from './styles';

const propTypes = {
    navigation: PropTypes.shape({
        getParam: PropTypes.func,
    }).isRequired,
};

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name,
    });

    constructor() {
        super();

        this.state = {
            stars: [],
            loading: false,
            page: 1,
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;
        const user = navigation.getParam('user');
        const { page } = this.state;

        this.setState({ loading: true });

        const response = await api.get(
            `/users/${user.login}/starred?page=${page}`
        );

        this.setState({
            stars: response.data,
            loading: false,
            page: page + 1,
        });
    }

    handleStars = async () => {
        const { navigation } = this.props;
        const user = navigation.getParam('user');
        const { stars, page } = this.state;

        this.setState({ loading: true });

        const response = await api.get(
            `/users/${user.login}/starred?page=${page}`
        );

        this.setState({
            stars: [...stars, ...response.data],
            page: page + 1,
            loading: false,
        });
    };

    render() {
        const { navigation } = this.props;
        const { stars, loading } = this.state;
        const user = navigation.getParam('user');
        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>
                {loading && (
                    <ActivityIndicator
                        color="#7159c1"
                        size={40}
                        style={{ marginTop: 10 }}
                    />
                )}
                <Stars
                    data={stars}
                    keyExtractor={star => String(star.id)}
                    onEndReached={this.handleStars}
                    renderItem={({ item }) => (
                        <Starred>
                            <OwnerAvatar
                                source={{ uri: item.owner.avatar_url }}
                            />
                            <Info>
                                <Title>{item.name}</Title>
                                <Author>{item.owner.name}</Author>
                            </Info>
                        </Starred>
                    )}
                />
                {/* {loading ? (
                    <LoadingIcon />
                ) : (
                    <Stars
                        data={stars}
                        keyExtractor={star => String(star.id)}
                        onEndReached={this.handleStars}
                        renderItem={({ item }) => (
                            <Starred>
                                <OwnerAvatar
                                    source={{ uri: item.owner.avatar_url }}
                                />
                                <Info>
                                    <Title>{item.name}</Title>
                                    <Author>{item.owner.name}</Author>
                                </Info>
                            </Starred>
                        )}
                    />
                )} */}
            </Container>
        );
    }
}

User.propTypes = propTypes;
