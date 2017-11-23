import models from '../models';
import groupLengthCheck from '../helpers/groupLengthCheck';
import errorResponse from '../helpers/errorResponse';

export default {
  create(req, res) {
    const { user } = req.body;
    let groupname = req.body.groupname;
    let description = req.body.description;
    if (!groupname || groupname.trim() === '') {
      const message = 'A group name is required';
      return errorResponse(res, 400, message, null);
    }
    if (!description || description.trim() === '') {
      const message = 'A group description is required';
      return errorResponse(res, 400, message, null);
    }
    groupname = req.body.groupname.toLowerCase();
    description = req.body.description;
    if (groupLengthCheck(res, groupname, description) !== 'validLength') {
      return;
    }
    return models.Group
      .create({
        groupname,
        description,
      })
      .then((group) => {
        group.addUser(user)
        .then(() => res.status(201).send({
          groupData: {
            groupname,
            description
          },
          message: `${group.groupname} was created successfully`,
        }));
      })
      .catch((error) => {
        if (error.errors[0].message === 'groupname must be unique') {
          const message = `${groupname} already exist`;
          errorResponse(res, 409, message, null);
        } else {
          return errorResponse(res, 500, null, error);
        }
      });
  },
  // Delete Group
  delete(req, res) {
    const { group, user } = req.body;
    const { username } = user;
    let { groupname } = group;
    groupname = groupname.toLowerCase();
    models.UserGroup
      .findOne({ where: { groupname }, attributes: ['username'] })
      .then((result) => {
        if (result.dataValues.username !== username) {
          const message =
            `You do not have permission to delete ${groupname}`;
          return errorResponse(res, 403, message, null);
        }
        models.UserGroup.destroy({ where: { groupname } });
        models.Message.destroy({ where: { toGroup: groupname } });
        group.destroy()
        .then(() =>
          res.status(200).send({
            group,
            message: `${groupname} has been archived`
          })
        ).catch(error => errorResponse(res, 500, null, error));
      }).catch(error => errorResponse(res, 500, null, error));
  },
  // Users can see all the groups that they belong to
  fetchMyGroups(req, res) {
    const { user } = req.body;
    user.getGroup()
    .then((groups) => {
      if (groups.length === 0) {
        res.status(200).send({ message: 'You have no group yet' });
      } else {
        return res.status(200).send(groups);
      }
    }).catch(error => errorResponse(res, 500, null, error));
  },
  // Add member to group
  addMember(req, res) {
    const { group, user, username } = req.body;
    const { groupname } = group;
    group.hasUser(user)
      .then((result) => {
        if (result) {
          const message = 'User already belong to group';
          return errorResponse(res, 409, message, null);
        }
        group.addUser(user)
        .then(member =>
          res.status(201).send({
            member: member[0][0],
            message:
            `${username} was added to ${groupname}`,
            status: 201
          })
        ).catch(error => errorResponse(res, 500, null, error));
      }).catch(error => errorResponse(res, 500, null, error));
  },
  // remove member from group
  removeMember(req, res) {
    const { user, group, username } = req.body;
    const { groupname } = group;
    group.hasUser(user)
      .then((userInGroup) => {
        if (!userInGroup) {
          const message = `No such user in ${groupname}`;
          return errorResponse(res, 404, message, null);
        }
        group.removeUser(user);
        group.getUser({ attribute: ['username'] })
        .then((result) => {
          if (result.length < 1) {
            models.UserGroup.destroy({ where: { groupname } });
            models.Message.destroy({ where: { toGroup: groupname } });
            group.destroy();
          }
          res.status(200).send({
            username,
            message:
            `${username} was successfully removed from ${groupname}`
          });
        }).catch(error => errorResponse(res, 500, null, error));
      }).catch(error => errorResponse(res, 500, null, error));
  },
  // Get List of group members
  fetchMembers(req, res) {
    const { group, user } = req.body;
    group.hasUser(user)
    .then((userInGroup) => {
      if (!userInGroup) {
        const errorMessage =
          `User does not belong to group '${req.params.groupname}'`;
        return errorResponse(res, 401, errorMessage, null);
      }
      group.getUser({ attributes: ['id', 'username', 'email', 'createdAt'] })
      .then(result => res.status(200).send(result))
      .catch(error => errorResponse(res, 500, null, error));
    }).catch(error => errorResponse(res, 500, null, error));
  }
};
