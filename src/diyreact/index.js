/** @jsx DiyReact.createElement */
import DiyReact from './diyReact';
// const DiyReact = importFormBelow();

const randomLikes = () => Math.ceil(Math.random * 100);
const stories = [
  { name: "DiyReact介绍", url: "http://google.com", likes: randomLikes() },
  { name: "Rendering DOM elements ", url: "http://google.com", likes: randomLikes() },
  { name: "Element creation and JSX", url: "http://google.com", likes: randomLikes() },
  { name: "Instances and reconciliation", url: "http://google.com", likes: randomLikes() },
  { name: "Components and state", url: "http://google.com", likes: randomLikes() }
];

class App extends DiyReact.Component {
  render() {

    return (
    <div>
      <h1>DiyReact Stories</h1>
      <ul>
        {this.props.stories.map(story => {
          return <Story name={story.name} url={story.url}></Story>;
        })}
      </ul>
    </div>
    )
  }

  componentWillMount() {
    console.log('execute componentWillMount');
  }

  componentDidMount() {
    console.log('execute componentDidMount');
  }

  componentWillUnmount() {
    console.log('execute componentWillUnmount');
  }
}

class Story extends DiyReact.Component {
  constructor(props) {
    super(props);
    this.state = { likes: Math.ceil(Math.random() * 100) };
  }

  like() {
    console.log('click');
    this.setState({
      likes: this.state.likes + 1
    })
  }

  render() {
    const { name, url } = this.props;
    const { likes } = this.state;
    const likesElement = <span />;

    return (
      <li>
        <button onClick={e => this.like()}>{likes}***</button>
        <a href={url}>{name}</a>
      </li>
    )
  }

  componentWillUpdate() {
    console.log('execute componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('execute componentDidUpdate');
  }
}
debugger;
DiyReact.render(<App stories={stories} />, document.getElementById('root'));