import { OxPlayer, Statuses } from 'player';

function UpdateStatuses(updateNet: boolean) {
  for (const name in Statuses) {
    const status = Statuses[name];

    if (!status?.onTick) continue;

    const curValue = OxPlayer.getStatus(name) || status.default;
    const newValue = curValue + status.onTick;

    OxPlayer.setStatus(
      name,
      newValue < 0 ? 0 : newValue > 100 ? 100 : parseFloat((curValue + status.onTick).toPrecision(4))
    );
  }

  emit('ox:statusTick', OxPlayer.getStatuses());

  if (updateNet) {
    emitNet('ox:updateStatuses', OxPlayer.getStatuses());
  }
}

on('ox:playerLoaded', () => {
  let timer = 0;

  const id: CitizenTimer = setInterval(() => {
    if (!OxPlayer.isLoaded) return clearInterval(id);

    timer++;

    if (timer === 60) {
      UpdateStatuses(true);
      timer = 0;
    } else {
      UpdateStatuses(false);
    };
  }, 1000);
});
