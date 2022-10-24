import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createQuestionbank, deleteQuestionbank, getQuestionbanks, patchQuestionbank } from '../api/questionbanks-api'
import Auth from '../auth/Auth'
import { Questionbank } from '../types/Questionbank'

interface QuestionbanksProps {
  auth: Auth
  history: History
}

interface QuestionbanksState {
  questionbanks: Questionbank[]
  newQuestionbankQuestion: string
  loadingQuestionbanks: boolean
}

export class Questionbanks extends React.PureComponent<QuestionbanksProps, QuestionbanksState> {
  state: QuestionbanksState = {
    questionbanks: [],
    newQuestionbankQuestion: '',
    loadingQuestionbanks: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newQuestionbankQuestion: event.target.value })
  }

  onEditButtonClick = (questionbankId: string) => {
    this.props.history.push(`/questionbanks/${questionbankId}/edit`)
  }

  onQuestionbankCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newQuestionbank = await createQuestionbank(this.props.auth.getIdToken(), {
        question: this.state.newQuestionbankQuestion,
        dueDate
      })
      this.setState({
        questionbanks: [...this.state.questionbanks, newQuestionbank],
        newQuestionbankQuestion: ''
      })
    } catch {
      alert('Questionbank creation failed')
    }
  }

  onQuestionbankDelete = async (questionbankId: string) => {
    try {
      await deleteQuestionbank(this.props.auth.getIdToken(), questionbankId)
      this.setState({
        questionbanks: this.state.questionbanks.filter(questionbank => questionbank.questionbankId !== questionbankId)
      })
    } catch {
      alert('Questionbank deletion failed')
    }
  }

  onQuestionbankCheck = async (pos: number) => {
    try {
      const questionbank = this.state.questionbanks[pos]
      await patchQuestionbank(this.props.auth.getIdToken(), questionbank.questionbankId, {
        question: questionbank.question,
        dueDate: questionbank.dueDate,
        done: !questionbank.done
      })
      this.setState({
        questionbanks: update(this.state.questionbanks, {
          [pos]: { done: { $set: !questionbank.done } }
        })
      })
    } catch {
      alert('Questionbank deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const questionbanks = await getQuestionbanks(this.props.auth.getIdToken())
      this.setState({
        questionbanks,
        loadingQuestionbanks: false
      })
    } catch (e) {
      alert(`Failed to fetch questionbanks: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">QUESTION BANK</Header>

        {this.renderCreateQuestionbankInput()}

        {this.renderQuestionbanks()}
      </div>
    )
  }

  renderCreateQuestionbankInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'orange',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Question',
              onClick: this.onQuestionbankCreate
            }}
            fluid
            actionPosition="left"
            placeholder="your question here"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderQuestionbanks() {
    if (this.state.loadingQuestionbanks) {
      return this.renderLoading()
    }

    return this.renderQuestionbanksList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading QUESTIONBANKs
        </Loader>
      </Grid.Row>
    )
  }

  renderQuestionbanksList() {
    return (
      <Grid padded>
        {this.state.questionbanks.map((questionbank, pos) => {
          return (
            <Grid.Row key={questionbank.questionbankId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onQuestionbankCheck(pos)}
                  checked={questionbank.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {questionbank.question}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {questionbank.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(questionbank.questionbankId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onQuestionbankDelete(questionbank.questionbankId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {questionbank.attachmentUrl && (
                <Image src={questionbank.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
