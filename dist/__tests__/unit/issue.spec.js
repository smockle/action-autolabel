import { Issue } from "../../lib/issue";
import { clientMock } from "./clientMock";
describe("Issue", () => {
    let issue;
    beforeAll(async () => {
        issue = new Issue(clientMock, {
            owner: "smockle",
            repo: "action-autolabel",
            issueNumber: 1,
        });
        expect(clientMock.rest.issues.get.called).toEqual(0);
        await issue.fetch();
        expect(clientMock.rest.issues.get.called).toEqual(1);
    });
    test(".body", () => {
        expect(issue.body).toEqual('Eligendi rerum deleniti quia repudiandae velit at non cumque `class="js-button button"`. Ipsum tempore non doloribus aut labore autem fuga hic a nested `<div>` inside a `<span>`. Sit distinctio est occaecati pariatur ad aut similique et voluptas. Sapiente ut omnis enim quae libero voluptatem unde et.\r\n\r\n#### Fails\r\n\r\n[4.1.1 Parsing (level A)](https://www.w3.org/WAI/WCAG22/Understanding/parsing)\r\n\r\ncc @smockle\r\n\r\nView the [repository](https://github.com/smockle/action-autolabel).');
    });
    test(".mentions, match found", () => {
        expect(issue.mentions("4.1.1")).toEqual(true);
    });
    test(".mentions, no match found", () => {
        expect(issue.mentions("0.0.0")).toEqual(false);
    });
    test(".mentions, missing body", async () => {
        const { owner, repo, issueNumber } = issue;
        const unfetchedIssue = new Issue(clientMock, { owner, repo, issueNumber });
        expect(unfetchedIssue.mentions("4.1.1")).toEqual(false);
    });
    test(".hasLabel, label found", () => {
        expect(issue.hasLabel("accessibility")).toEqual(true);
    });
    test(".hasLabel, no label found", () => {
        expect(issue.hasLabel("A LABEL THAT DOES NOT EXIST")).toEqual(false);
    });
    test(".addLabels()", () => {
        expect(clientMock.rest.issues.addLabels.called).toEqual(0);
        issue.addLabels(["WCAG 4.1.1"]);
        expect(clientMock.rest.issues.addLabels.called).toEqual(1);
    });
    test(".removeLabel()", () => {
        expect(clientMock.rest.issues.removeLabel.called).toEqual(0);
        issue.removeLabel("WCAG 4.1.1");
        expect(clientMock.rest.issues.removeLabel.called).toEqual(1);
    });
});