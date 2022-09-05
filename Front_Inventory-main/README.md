# Front_Inventory

## Development process
### 1. Creating a branch
When it is time to start a task, you must create a new branch based on the main one, its name must follow the following pattern:
```
<BRANCH_TYPE>/<PROJECT_KEY>-<TICKET_ID>
```
Types of branches:

_**feature:** It is used when new components or functions are developed._

_**bugfix:** It is used to correct an unwanted state of a production version or that affects other areas of development._

### 2. Change Log
We need to keep track of all the changes in the components, for this we need to keep the ``` CHANGELOG.md ``` file updated, with the following structure.

```
## [X.Y.Z](PR_URL) (YYYY-MM-DD) -> Date and Pull Request of the last change
**Added/Fixed**
- [PROJ-ZZZ](TICKET_URL) <Description of the change> ->  And ticket URL
```

**Example:**

```
[0.1.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull-requests/1) (2021-03-14)
**Added**
- [IV-01] Adding the login service. 
```

### 3. Certify your changes
Ensuring that the changes work as expected is a two-step process:

_**Local tests:** Each developer must test the changes on their machines._

_**Development testing and quality control:**_ When the developer is sure to promote the changes, they must create a PR, must be approved by other teammates and finally merged using ```--squash.```

### 4. Who can merge branches?

_**BE leader:** Juan David González - [TOYCRESJDGM](https://github.com/TOYCRESJDGM)_

_**FE leader:** Natalia Vargas - [vargas-ins](https://github.com/vargas-ins)_

_**Project manager:** Natalia Rodríguez - [NataliaRodriguez98](https://github.com/NataliaRodriguez98)_ 
