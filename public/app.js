
async function setUpApp() {

  const APP_CONFIG = (await axios.get('/get_vault_id')).data;
  console.log("Vault ID:", APP_CONFIG.vault_id)
  let CARD_DATA = {}
  let SEC_EL_CARD_NUMBER = null;
  let SEC_EL_CARD_CVC = null;

  // Show.js initialization
  const show = VGSShow.create(APP_CONFIG.vault_id, function (state) {
    console.log(state);
  }).setEnvironment('sandbox');
  $('#issue-card-btn').on('click', async function () {
    CARD_DATA = (await axios.get('/issue_card')).data;
    let last4 = CARD_DATA.card_number.substr(-4);
    $('#redacted-card-number').removeClass('transparent');
    $('#redacted-card-number-last-4').html(last4);
    $('#card-wrapper').removeClass('d-none');
    $('#server-results').removeClass('d-none')
    $('#issue-card-btn').hide();
    $('#card-tokens').html(JSON.stringify(CARD_DATA, null, 4));
    $('#good-thru-value').html(CARD_DATA.expiry)
    $('.name h3').html(CARD_DATA.name)
    securelyLoadCardNumber()
  });

  function configureShowForRecord(row, record) {
    let btn = row.find('[name=show-card-btn]')
    let show = VGSShow.create(APP_CONFIG.vault_id, function (state) {
      console.log(state);
    }).setEnvironment('sandbox');

    btn.on('click', async function () {
      securelyLoadCardNumber(show, row, record)
    });
  }

  async function loadRecords() {
    let records = (await axios.get('/load_records')).data
    let $customersTable = $('#customer-table');
    for (let i in records) {
      let record = records[i];
      $row = $customersTable.find("#template").clone()
      $row.removeClass("d-none")
      $row.find('[name=name]').html(record.name)
      $row.find('[name=email]').html(record.email)
      $row.find('[name=phone]').html(record.phone)
      $row.find('[name=card_number_token]').html(record.card_number_token)
      $row.find('[name=card]').attr("id", "show-card-" + record.id)
      configureShowForRecord($row, record)
      $customersTable.append($row)
    }
  }

  function securelyLoadCardNumber(show, row, record) {
    let showIframe = show.request({
      name: `show-card-${record.id}}`,
      method: 'POST',
      path: '/reveal_card_number',
      payload: { 'card_number': record.card_number_token },
      htmlWrapper: 'text',
      jsonPathSelector: 'card_number',
      serializers: [show.SERIALIZERS.replace('(\\d{4})(\\d{4})(\\d{4})(\\d{4})', '$1 $2 $3 $4')],
    });

    row.find('[name=loading-animation]').show()
    row.find('[name=loading-animation-image]').show()
    row.find('[name=show-card-btn]').hide()
    showIframe.render(`#show-card-${record.id}`, {
      color: 'black',
      fontWeight: 'bold',
      fontFamily: 'sofia, sofiaFallback, arial, sans-serif;'
    });

    showIframe.on('revealSuccess', function() {
      row.find('[name=card_number_token]').hide()
      row.find('[name=loading-animation-image]').hide()
      setTimeout(() => {
        showIframe.unmount()
        row.find('[name=loading-animation]').hide()
        row.find('[name=card_number_token]').show()
        row.find('[name=show-card-btn]').show()
      }, 5000)
    })
  }
  loadRecords()
}
setUpApp()