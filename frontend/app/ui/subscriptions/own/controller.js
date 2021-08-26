import Controller from "@ember/controller";
import { alias } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import ENV from "customer-center/config/environment";

export default class SubscriptionsOwnController extends Controller {
  @service account;
  @service intl;

  @alias("model") projects;

  get showReloadLink() {
    return this.account.isInGroups("one", [
      ENV.auth.adminRole,
      ENV.auth.customerRole,
    ]);
  }

  breadcrumbs = [
    { label: this.intl.t("page.subscriptions.title"), route: "subscriptions" },
    { label: this.intl.t("page.subscriptions.own.title") },
  ];
}
